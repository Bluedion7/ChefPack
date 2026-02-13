const express = require('express');
const router = express.Router();
const authController = require('./controller');
const { body } = require('express-validator');

// Send OTP
router.post('/send-otp',
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  authController.sendOTP
);

// Verify OTP
router.post('/verify-otp',
  body('phone').isMobilePhone(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  authController.verifyOTP
);

// Refresh token
router.post('/refresh-token',
  body('refreshToken').notEmpty(),
  authController.refreshToken
);

// Logout
router.post('/logout',
  body('refreshToken').notEmpty(),
  authController.logout
);

// Validate token
router.post('/validate',
  body('token').notEmpty(),
  authController.validateToken
);

module.exports = router;

