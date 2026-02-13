const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const { PrismaClient: PrismaCooksClient } = require('@prisma/client-cooks');
const { validationResult } = require('express-validator');

const prismaCooks = new PrismaCooksClient();

// Get all pending kitchen verifications
const getPendingKitchenVerifications = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const pendingCooks = await prismaCooks.cook.findMany({
      where: {
        kitchenAddress: { not: null },
        kitchenVerified: false
      },
      select: {
        id: true,
        userId: true,
        businessName: true,
        kitchenAddress: true,
        kitchenDocs: true,
        createdAt: true,
        updatedAt: true
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { updatedAt: 'desc' }
    });

    const total = await prismaCooks.cook.count({
      where: {
        kitchenAddress: { not: null },
        kitchenVerified: false
      }
    });

    res.json({
      success: true,
      data: pendingCooks,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all verified kitchens
const getVerifiedKitchens = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const verifiedCooks = await prismaCooks.cook.findMany({
      where: {
        kitchenVerified: true
      },
      select: {
        id: true,
        userId: true,
        businessName: true,
        kitchenAddress: true,
        kitchenVerifiedAt: true,
        createdAt: true
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { kitchenVerifiedAt: 'desc' }
    });

    const total = await prismaCooks.cook.count({
      where: { kitchenVerified: true }
    });

    res.json({
      success: true,
      data: verifiedCooks,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Approve kitchen verification
const approveKitchenVerification = async (req, res, next) => {
  try {
    const { cookId } = req.params;
    const adminUserId = req.user.userId;

    const cook = await prismaCooks.cook.findUnique({
      where: { id: cookId }
    });

    if (!cook) {
      throw new AppError('Cook not found', 404);
    }

    if (!cook.kitchenAddress) {
      throw new AppError('No kitchen information submitted', 400);
    }

    if (cook.kitchenVerified) {
      throw new AppError('Kitchen already verified', 400);
    }

    const updatedCook = await prismaCooks.cook.update({
      where: { id: cookId },
      data: {
        kitchenVerified: true,
        kitchenVerifiedAt: new Date(),
        kitchenRejectedReason: null
      }
    });

    // TODO: Emit BullMQ event for cook notification
    logger.info(`Kitchen verified for cook ${cookId} by admin ${adminUserId}`);

    res.json({
      success: true,
      message: 'Kitchen verification approved',
      data: {
        id: updatedCook.id,
        businessName: updatedCook.businessName,
        kitchenVerified: updatedCook.kitchenVerified,
        kitchenVerifiedAt: updatedCook.kitchenVerifiedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Reject kitchen verification
const rejectKitchenVerification = async (req, res, next) => {
  try {
    const { cookId } = req.params;
    const { reason } = req.body;
    const adminUserId = req.user.userId;

    if (!reason) {
      throw new AppError('Rejection reason is required', 400);
    }

    const cook = await prismaCooks.cook.findUnique({
      where: { id: cookId }
    });

    if (!cook) {
      throw new AppError('Cook not found', 404);
    }

    if (!cook.kitchenAddress) {
      throw new AppError('No kitchen information submitted', 400);
    }

    const updatedCook = await prismaCooks.cook.update({
      where: { id: cookId },
      data: {
        kitchenVerified: false,
        kitchenVerifiedAt: null,
        kitchenRejectedReason: reason
      }
    });

    // TODO: Emit BullMQ event for cook notification
    logger.info(`Kitchen rejected for cook ${cookId} by admin ${adminUserId}: ${reason}`);

    res.json({
      success: true,
      message: 'Kitchen verification rejected',
      data: {
        id: updatedCook.id,
        businessName: updatedCook.businessName,
        kitchenVerified: updatedCook.kitchenVerified,
        kitchenRejectedReason: updatedCook.kitchenRejectedReason
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingKitchenVerifications,
  getVerifiedKitchens,
  approveKitchenVerification,
  rejectKitchenVerification
};

