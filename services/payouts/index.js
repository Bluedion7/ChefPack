require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('../../shared/logger');
const { errorHandler } = require('../../shared/middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.PAYOUTS_SERVICE_PORT || 3011;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'payouts-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', routes);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  logger.info(`📦 Payouts Service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('payouts Service closed');
    process.exit(0);
  });
});

module.exports = app;
