require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'test-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: PORT
    }
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Test endpoint working!',
    services: [
      'auth', 'users', 'cooks', 'menu', 'plans', 
      'orders', 'matching', 'ingredients', 'dispatch',
      'payments', 'payouts', 'notifications', 'support',
      'ratings', 'webhook'
    ]
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Test service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

