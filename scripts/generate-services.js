const fs = require('fs');
const path = require('path');

const services = [
  { name: 'users', port: 3002, description: 'User profiles, RBAC, address management' },
  { name: 'cooks', port: 3003, description: 'Cook onboarding, availability, pricing' },
  { name: 'menu', port: 3004, description: 'Meals, tags, dietary restrictions' },
  { name: 'plans', port: 3005, description: 'Subscription plans, membership tiers' },
  { name: 'orders', port: 3006, description: 'Order lifecycle, SLA tracking' },
  { name: 'matching', port: 3007, description: 'Cook-order assignment algorithm' },
  { name: 'ingredients', port: 3008, description: 'Ingredient lists, substitutions' },
  { name: 'dispatch', port: 3009, description: 'ShipPack integration' },
  { name: 'payments', port: 3010, description: 'Charges, refunds' },
  { name: 'payouts', port: 3011, description: 'Cook earnings, settlements' },
  { name: 'notifications', port: 3012, description: 'SMS, Email, Push notifications' },
  { name: 'support', port: 3013, description: 'Disputes, tickets' },
  { name: 'ratings', port: 3014, description: 'Reviews and ratings' },
  { name: 'webhook', port: 3015, description: 'Handle external webhooks' },
];

const createServiceFiles = (service) => {
  const serviceDir = path.join(__dirname, '..', 'services', service.name);
  
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  // index.js
  const indexContent = `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('../../shared/logger');
const { errorHandler } = require('../../shared/middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.${service.name.toUpperCase()}_SERVICE_PORT || ${service.port};

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: '${service.name}-service',
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
  logger.info(\`📦 ${service.name.charAt(0).toUpperCase() + service.name.slice(1)} Service running on port \${PORT}\`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('${service.name} Service closed');
    process.exit(0);
  });
});

module.exports = app;
`;

  // routes.js
  const routesContent = `const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authMiddleware } = require('../../shared/middleware/auth');

// Add your routes here
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
`;

  // controller.js
  const controllerContent = `const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');

const getAll = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.json({
      success: true,
      message: '${service.description}',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic
    res.json({
      success: true,
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.status(201).json({
      success: true,
      message: 'Created successfully',
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'Updated successfully',
      data: { id, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteRecord
};
`;

  // Dockerfile
  const dockerfileContent = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY shared ./shared
COPY services/${service.name} ./services/${service.name}

WORKDIR /app/services/${service.name}

EXPOSE ${service.port}

CMD ["node", "index.js"]
`;

  fs.writeFileSync(path.join(serviceDir, 'index.js'), indexContent);
  fs.writeFileSync(path.join(serviceDir, 'routes.js'), routesContent);
  fs.writeFileSync(path.join(serviceDir, 'controller.js'), controllerContent);
  fs.writeFileSync(path.join(serviceDir, 'Dockerfile'), dockerfileContent);

  console.log(`✅ Created ${service.name} service`);
};

services.forEach(createServiceFiles);
console.log('🎉 All services generated successfully!');

