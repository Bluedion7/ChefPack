const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const redis = require('../../shared/redis');
const { PrismaClient: PrismaAuthClient } = require('@prisma/client-auth');

const prismaAuth = new PrismaAuthClient();

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone } = req.body;
    const otp = generateOTP();
    const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000;

    // Store OTP
    otpStore.set(phone, { otp, expiresAt });

    // TODO: Send OTP via AWS SNS
    logger.info(`OTP generated for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: process.env.OTP_EXPIRY_MINUTES || 10,
      // Remove in production
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone, otp } = req.body;
    const storedData = otpStore.get(phone);

    if (!storedData) {
      throw new AppError('OTP not found or expired', 400);
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      throw new AppError('OTP expired', 400);
    }

    if (storedData.otp !== otp) {
      throw new AppError('Invalid OTP', 400);
    }

    // Clear OTP
    otpStore.delete(phone);

    // Upsert user by phone
    const user = await prismaAuth.user.upsert({
      where: { phone },
      update: {
        lastLoginAt: new Date(),
        phoneVerified: true
      },
      create: {
        phone,
        phoneVerified: true,
        lastLoginAt: new Date()
      }
    });

    // Generate tokens with userId
    const accessToken = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, phone: user.phone, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 400);
    }

    const accessToken = jwt.sign(
      { phone: decoded.phone, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
};

const logout = async (req, res, next) => {
  try {
    // TODO: Blacklist token in Redis
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

const validateToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      success: true,
      valid: true,
      data: decoded
    });
  } catch (error) {
    res.json({
      success: false,
      valid: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  validateToken
};

