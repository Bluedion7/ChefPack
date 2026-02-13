const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authMiddleware, requireRole } = require('../../shared/middleware/auth');

// Kitchen verification routes (admin only)
router.get(
  '/kitchen-verifications/pending',
  authMiddleware,
  requireRole('ADMIN', 'SUPPORT'),
  controller.getPendingKitchenVerifications
);

router.get(
  '/kitchen-verifications/verified',
  authMiddleware,
  requireRole('ADMIN', 'SUPPORT'),
  controller.getVerifiedKitchens
);

router.post(
  '/kitchen-verifications/:cookId/approve',
  authMiddleware,
  requireRole('ADMIN'),
  controller.approveKitchenVerification
);

router.post(
  '/kitchen-verifications/:cookId/reject',
  authMiddleware,
  requireRole('ADMIN'),
  controller.rejectKitchenVerification
);

module.exports = router;

