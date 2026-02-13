const logger = require('../../shared/logger');
const { AppError } = require('../../shared/middleware/errorHandler');
const { PrismaClient: PrismaOrdersClient } = require('@prisma/client-orders');
const { PrismaClient: PrismaAuthClient } = require('@prisma/client-auth');
const { PrismaClient: PrismaCooksClient } = require('@prisma/client-cooks');

const prismaOrders = new PrismaOrdersClient();
const prismaAuth = new PrismaAuthClient();
const prismaCooks = new PrismaCooksClient();

const getAll = async (req, res, next) => {
  try {
    // TODO: Implement logic
    res.json({
      success: true,
      message: 'Order lifecycle, SLA tracking',
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
    const userId = req.user.userId;
    const { items, deliveryAddress, deliveryDate, deliveryTime, specialInstructions, override } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    // Fetch user preferences
    const userPreference = await prismaAuth.userPreference.findUnique({
      where: { userId }
    });

    // Fetch all meals in the order
    const mealIds = items.map(item => item.mealId);
    const meals = await prismaCooks.meal.findMany({
      where: { id: { in: mealIds } },
      include: {
        cook: {
          select: {
            id: true,
            businessName: true,
            kitchenVerified: true,
            kitchenAddress: true
          }
        }
      }
    });

    if (meals.length !== mealIds.length) {
      throw new AppError('One or more meals not found', 404);
    }

    // Check if all cooks have verified kitchens
    const unverifiedCooks = meals.filter(meal => !meal.cook.kitchenVerified);
    if (unverifiedCooks.length > 0) {
      const cookNames = unverifiedCooks.map(m => m.cook.businessName).join(', ');
      throw new AppError(
        `Cannot create order. The following cooks have unverified kitchens: ${cookNames}. Please choose meals from verified cooks.`,
        400
      );
    }

    // Get the cook for this order (assuming single cook per order)
    const cook = meals[0].cook;
    const kitchenPickupSnapshot = {
      cookId: cook.id,
      businessName: cook.businessName,
      kitchenAddress: cook.kitchenAddress,
      snapshotAt: new Date()
    };

    // Check for conflicts if user has preferences
    const conflicts = [];
    if (userPreference) {
      for (const meal of meals) {
        const mealAllergens = meal.allergens || [];
        const mealDietTags = meal.dietaryTags || [];

        // Check severe allergen conflicts
        if (userPreference.allergenSeverity === 'severe' && userPreference.allergens.length > 0) {
          const allergenConflicts = userPreference.allergens.filter(allergen =>
            mealAllergens.includes(allergen)
          );
          if (allergenConflicts.length > 0) {
            conflicts.push({
              mealId: meal.id,
              mealName: meal.name,
              type: 'severe_allergen',
              details: allergenConflicts
            });
          }
        }

        // Check diet mismatches
        if (userPreference.dietTags.length > 0) {
          const dietMap = {
            'gluten_free_pref': 'gluten-free',
            'halal_pref': 'halal',
            'low_sodium_pref': 'low-sodium'
          };

          const unmatchedDiets = userPreference.dietTags.filter(diet => {
            const mealTag = dietMap[diet] || diet;
            return !mealDietTags.includes(mealTag);
          });

          if (unmatchedDiets.length > 0) {
            conflicts.push({
              mealId: meal.id,
              mealName: meal.name,
              type: 'diet_mismatch',
              details: unmatchedDiets
            });
          }
        }
      }
    }

    // If conflicts exist and override is not accepted, return 409
    if (conflicts.length > 0 && !override) {
      return res.status(409).json({
        success: false,
        message: 'Order contains items that conflict with your dietary preferences',
        conflicts,
        requiresOverride: true
      });
    }

    // Calculate order totals (simplified)
    const totalAmount = items.reduce((sum, item) => {
      const meal = meals.find(m => m.id === item.mealId);
      return sum + (meal.price * item.quantity);
    }, 0);
    const deliveryFee = 5.99;
    const tax = totalAmount * 0.08;
    const finalAmount = totalAmount + deliveryFee + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with preference snapshot and kitchen pickup snapshot
    const order = await prismaOrders.order.create({
      data: {
        orderNumber,
        customerId: userId,
        cookId: cook.id,
        status: 'PENDING',
        totalAmount,
        deliveryFee,
        tax,
        finalAmount,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        specialInstructions,
        preferenceSnapshot: userPreference ? JSON.parse(JSON.stringify(userPreference)) : null,
        overrideAccepted: override || false,
        kitchenPickupSnapshot,
        slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        items: {
          create: items.map(item => {
            const meal = meals.find(m => m.id === item.mealId);
            return {
              mealId: item.mealId,
              mealName: meal.name,
              quantity: item.quantity,
              price: meal.price,
              subtotal: meal.price * item.quantity
            };
          })
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
      ...(conflicts.length > 0 && { warnings: conflicts })
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
