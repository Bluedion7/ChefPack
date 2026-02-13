const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const { PrismaClient: PrismaAuthClient } = require('@prisma/client-auth');
const { validationResult } = require('express-validator');

const prismaAuth = new PrismaAuthClient();

// Valid enum values
const VALID_DIET_TAGS = ['keto', 'pescatarian', 'vegan', 'vegetarian', 'gluten_free_pref', 'halal_pref', 'low_sodium_pref'];
const VALID_ALLERGENS = ['peanuts', 'tree_nuts', 'shellfish', 'fish', 'dairy', 'eggs', 'wheat_gluten', 'soy', 'sesame', 'other'];
const VALID_ALLERGEN_SEVERITY = ['mild', 'severe'];

const getAll = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'User profiles, RBAC, address management',
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

const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const preference = await prismaAuth.userPreference.findUnique({
      where: { userId }
    });

    if (!preference) {
      return res.json({
        success: true,
        data: null,
        message: 'No preferences set'
      });
    }

    res.json({
      success: true,
      data: preference
    });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userId = req.user.userId;
    const {
      dietTags,
      allergens,
      allergenOtherText,
      allergenSeverity,
      avoidCrossContact,
      spiceLevel,
      tasteLikes,
      tasteDislikes
    } = req.body;

    // Validate diet tags
    if (dietTags && !Array.isArray(dietTags)) {
      throw new AppError('dietTags must be an array', 400);
    }
    if (dietTags && dietTags.some(tag => !VALID_DIET_TAGS.includes(tag))) {
      throw new AppError(`Invalid diet tag. Valid values: ${VALID_DIET_TAGS.join(', ')}`, 400);
    }

    // Validate allergens
    if (allergens && !Array.isArray(allergens)) {
      throw new AppError('allergens must be an array', 400);
    }
    if (allergens && allergens.some(allergen => !VALID_ALLERGENS.includes(allergen))) {
      throw new AppError(`Invalid allergen. Valid values: ${VALID_ALLERGENS.join(', ')}`, 400);
    }

    // Validate allergen severity
    if (allergenSeverity && !VALID_ALLERGEN_SEVERITY.includes(allergenSeverity)) {
      throw new AppError(`Invalid allergenSeverity. Valid values: ${VALID_ALLERGEN_SEVERITY.join(', ')}`, 400);
    }

    // Validate spice level
    if (spiceLevel !== undefined && (spiceLevel < 0 || spiceLevel > 3)) {
      throw new AppError('spiceLevel must be between 0 and 3', 400);
    }

    // Validate arrays
    if (tasteLikes && !Array.isArray(tasteLikes)) {
      throw new AppError('tasteLikes must be an array', 400);
    }
    if (tasteDislikes && !Array.isArray(tasteDislikes)) {
      throw new AppError('tasteDislikes must be an array', 400);
    }

    // Upsert preferences
    const preference = await prismaAuth.userPreference.upsert({
      where: { userId },
      update: {
        ...(dietTags !== undefined && { dietTags }),
        ...(allergens !== undefined && { allergens }),
        ...(allergenOtherText !== undefined && { allergenOtherText }),
        ...(allergenSeverity !== undefined && { allergenSeverity }),
        ...(avoidCrossContact !== undefined && { avoidCrossContact }),
        ...(spiceLevel !== undefined && { spiceLevel }),
        ...(tasteLikes !== undefined && { tasteLikes }),
        ...(tasteDislikes !== undefined && { tasteDislikes })
      },
      create: {
        userId,
        dietTags: dietTags || [],
        allergens: allergens || [],
        allergenOtherText,
        allergenSeverity: allergenSeverity || 'mild',
        avoidCrossContact: avoidCrossContact || false,
        spiceLevel: spiceLevel !== undefined ? spiceLevel : 1,
        tasteLikes: tasteLikes || [],
        tasteDislikes: tasteDislikes || []
      }
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: preference
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
  getPreferences,
  updatePreferences
};
