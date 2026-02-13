const express = require('express');
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
