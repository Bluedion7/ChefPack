const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const redis = require('../../shared/redis');

// OTP Configuration
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_MINUTES) * 60;
const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
const LOCKOUT_DURATION = parseInt(process.env.LOCKOUT_DURATION_MINUTES) * 60;

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send OTP via SMS (AWS SNS)
 */
async function sendOTPViaSMS(phone, otp) {
  if (process.env.NODE_ENV === 'development' || process.env.MOCK_EXTERNAL_APIS === 'true') {
    logger.info(`[DEV MODE] OTP for ${phone}: ${otp}`);
    return true;
  }

  try {
    const AWS = require('aws-sdk');
    const sns = new AWS.SNS({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    await sns.publish({
      Message: `Your ChefPack verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
      PhoneNumber: phone,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: process.env.SNS_SENDER_ID
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    }).promise();

    return true;
  } catch (error) {
    logger.error('SMS sending error:', error);
    throw new Error('Failed to send OTP');
  }
}

/**
 * Generate JWT tokens
 */
function generateTokens(userId, phone, role) {
  const accessToken = jwt.sign(
    { userId, phone, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, phone, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
}

const sendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phone } = req.body;

    // Check if phone is locked
    const lockKey = `auth:lock:${phone}`;
    const isLocked = await redis.get(lockKey);
    
    if (isLocked) {
      const ttl = await redis.ttl(lockKey);
      return res.status(429).json({
        success: false,
        message: `Too many attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // Store OTP in Redis
    const otpKey = `auth:otp:${phone}`;
    await redis.setex(otpKey, OTP_EXPIRY, otpHash);

    // Send OTP via SMS
    await sendOTPViaSMS(phone, otp);

    logger.info(`OTP sent to ${phone}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phone,
        expiresIn: OTP_EXPIRY,
        ...(process.env.NODE_ENV === 'development' && { otp })
      }
    });
  } catch (error) {
    logger.error('Send OTP error:', error);
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

    // Check if phone is locked
    const lockKey = `auth:lock:${phone}`;
    const isLocked = await redis.get(lockKey);
    
    if (isLocked) {
      const ttl = await redis.ttl(lockKey);
      return res.status(429).json({
        success: false,
        message: `Account locked. Try again in ${Math.ceil(ttl / 60)} minutes.`
      });
    }

    // Get stored OTP hash
    const otpKey = `auth:otp:${phone}`;
    const storedOTPHash = await redis.get(otpKey);

    if (!storedOTPHash) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or invalid'
      });
    }

