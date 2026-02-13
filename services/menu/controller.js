const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const { PrismaClient: PrismaCooksClient } = require('@prisma/client-cooks');
const { PrismaClient: PrismaAuthClient } = require('@prisma/client-auth');
const jwt = require('jsonwebtoken');

const prismaCooks = new PrismaCooksClient();
const prismaAuth = new PrismaAuthClient();

const getAll = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'Meals, tags, dietary restrictions',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch meal
    const meal = await prismaCooks.meal.findUnique({
      where: { id },
      include: {
        cook: {
          select: {
            businessName: true,
            rating: true
          }
        }
      }
    });

    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    // Check if user is authenticated and has preferences
    let compatibility = null;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userId) {
          const userPreference = await prismaAuth.userPreference.findUnique({
            where: { userId: decoded.userId }
          });

          if (userPreference) {
            compatibility = checkMealCompatibility(meal, userPreference);
          }
        }
      } catch (err) {
        // Invalid token, skip compatibility check
        logger.warn('Invalid token for compatibility check:', err.message);
      }
    }

    res.json({
      success: true,
      data: {
        ...meal,
        ...(compatibility && { compatibility })
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check meal compatibility with user preferences
function checkMealCompatibility(meal, userPreference) {
  const reasons = [];
  let compatible = true;

  // Check allergens
  if (userPreference.allergens && userPreference.allergens.length > 0) {
    const mealAllergens = meal.allergens || [];
    const conflictingAllergens = userPreference.allergens.filter(allergen =>
      mealAllergens.includes(allergen)
    );

    if (conflictingAllergens.length > 0) {
      compatible = false;
      conflictingAllergens.forEach(allergen => {
        reasons.push(`contains_allergen:${allergen}`);
      });
    }
  }

  // Check diet tags
  if (userPreference.dietTags && userPreference.dietTags.length > 0) {
    const mealDietTags = meal.dietaryTags || [];
    const unmatchedDiets = userPreference.dietTags.filter(diet => {
      // Map preference tags to meal tags
      const dietMap = {
        'gluten_free_pref': 'gluten-free',
        'halal_pref': 'halal',
        'low_sodium_pref': 'low-sodium'
      };
      const mealTag = dietMap[diet] || diet;
      return !mealDietTags.includes(mealTag);
    });

    if (unmatchedDiets.length > 0) {
      compatible = false;
      unmatchedDiets.forEach(diet => {
        reasons.push(`diet_not_matched:${diet}`);
      });
    }
  }

  return {
    compatible,
    reasons
  };
}

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
