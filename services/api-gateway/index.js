require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../../shared/logger');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.GATEWAY_RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.GATEWAY_RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use('/api', limiter);

// Health check
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api-gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Service routes with default fallback ports matching .env.example
const services = [
  { path: '/api/v1/auth', target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001' },
  { path: '/api/v1/users', target: process.env.USERS_SERVICE_URL || 'http://localhost:3002' },
  { path: '/api/v1/cooks', target: process.env.COOKS_SERVICE_URL || 'http://localhost:3003' },
  { path: '/api/v1/menu', target: process.env.MENU_SERVICE_URL || 'http://localhost:3004' },
  { path: '/api/v1/plans', target: process.env.PLANS_SERVICE_URL || 'http://localhost:3005' },
  { path: '/api/v1/orders', target: process.env.ORDERS_SERVICE_URL || 'http://localhost:3006' },
  { path: '/api/v1/payments', target: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3010' },
  { path: '/api/v1/payouts', target: process.env.PAYOUTS_SERVICE_URL || 'http://localhost:3011' },
  { path: '/api/v1/notifications', target: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3012' },
  { path: '/api/v1/support', target: process.env.SUPPORT_SERVICE_URL || 'http://localhost:3013' },
  { path: '/api/v1/ratings', target: process.env.RATINGS_SERVICE_URL || 'http://localhost:3014' },
  { path: '/api/v1/webhooks', target: process.env.WEBHOOK_SERVICE_URL || 'http://localhost:3015' },
  { path: '/api/v1/admin', target: process.env.ADMIN_SERVICE_URL || 'http://localhost:3016' },
];

services.forEach(({ path, target }) => {
  if (!target) {
    logger.warn(`Skipping proxy for ${path}: no target URL configured`);
    return;
  }
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: '/api/v1' },
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${path}:`, err);
      res.status(503).json({ 
        success: false, 
        message: 'Service temporarily unavailable' 
      });
    },
  }));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  logger.info(`🚪 API Gateway running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('API Gateway closed');
    process.exit(0);
  });
});

module.exports = app;

