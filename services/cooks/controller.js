const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const { PrismaClient: PrismaCooksClient } = require('@prisma/client-cooks');
const { validationResult } = require('express-validator');

const prismaCooks = new PrismaCooksClient();

const getAll = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'Cook onboarding, availability, pricing',
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

// Submit kitchen information for verification
const submitKitchen = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userId = req.user.userId;
    const { kitchenAddress, kitchenDocs } = req.body;

    // Validate kitchen address
    if (!kitchenAddress || !kitchenAddress.street || !kitchenAddress.city ||
        !kitchenAddress.state || !kitchenAddress.zipCode) {
      throw new AppError('Complete kitchen address is required', 400);
    }

    // Validate kitchen docs
    if (!kitchenDocs || !kitchenDocs.healthPermit || !kitchenDocs.insuranceCert) {
      throw new AppError('Health permit and insurance certificate are required', 400);
    }

    // Find cook by userId
    const cook = await prismaCooks.cook.findUnique({
      where: { userId }
    });

    if (!cook) {
      throw new AppError('Cook profile not found. Please complete cook registration first.', 404);
    }

    // Update cook with kitchen information
    const updatedCook = await prismaCooks.cook.update({
      where: { id: cook.id },
      data: {
        kitchenAddress,
        kitchenDocs,
        kitchenVerified: false, // Reset verification status
        kitchenVerifiedAt: null,
        kitchenRejectedReason: null
      }
    });

    // TODO: Emit BullMQ event for admin notification
    logger.info(`Kitchen verification submitted for cook ${cook.id}`);

    res.json({
      success: true,
      message: 'Kitchen information submitted for verification',
      data: {
        id: updatedCook.id,
        kitchenAddress: updatedCook.kitchenAddress,
        kitchenVerified: updatedCook.kitchenVerified,
        status: 'pending_verification'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get kitchen verification status
const getKitchenStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cook = await prismaCooks.cook.findUnique({
      where: { userId },
      select: {
        id: true,
        kitchenVerified: true,
        kitchenAddress: true,
        kitchenVerifiedAt: true,
        kitchenRejectedReason: true
      }
    });

    if (!cook) {
      throw new AppError('Cook profile not found', 404);
    }

    const status = cook.kitchenVerified
      ? 'verified'
      : (cook.kitchenAddress ? 'pending_verification' : 'not_submitted');

    res.json({
      success: true,
      data: {
        status,
        kitchenVerified: cook.kitchenVerified,
        kitchenAddress: cook.kitchenAddress,
        kitchenVerifiedAt: cook.kitchenVerifiedAt,
        kitchenRejectedReason: cook.kitchenRejectedReason
      }
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
  delete: deleteRecord,
  submitKitchen,
  getKitchenStatus
};
