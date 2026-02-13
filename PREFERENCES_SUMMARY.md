# Customer Preference Profile - Implementation Summary

## ✅ Implementation Complete

All customer preference profile features have been successfully implemented for the ChefPack USA-only application.

## 📋 Files Changed

### Database Schemas (2 files)
1. **`prisma/schema-auth.prisma`**
   - Added `UserPreference` model with 1:1 relation to User
   - Added `AllergenSeverity` enum (mild, severe)
   - Fields: dietTags, allergens, allergenOtherText, allergenSeverity, avoidCrossContact, spiceLevel, tasteLikes, tasteDislikes

2. **`prisma/schema-orders.prisma`**
   - Added `preferenceSnapshot` (Json) to Order model
   - Added `overrideAccepted` (Boolean) to Order model

### Service Controllers (4 files)
3. **`services/auth/controller.js`**
   - Added Prisma Auth client
   - Updated `verifyOTP` to upsert User by phone
   - JWT now includes `userId` in payload (required for all authenticated requests)

4. **`services/users/controller.js`**
   - Added Prisma Auth client
   - Added validation constants for diet tags, allergens, severity
   - New `getPreferences()` - GET /preferences/me
   - New `updatePreferences()` - PUT /preferences/me with full validation

5. **`services/menu/controller.js`**
   - Added Prisma Cooks and Auth clients
   - Updated `getById()` to check meal compatibility vs user preferences
   - New `checkMealCompatibility()` helper function
   - Returns compatibility object: `{ compatible: boolean, reasons: string[] }`

6. **`services/orders/controller.js`**
   - Added Prisma Orders, Auth, and Cooks clients
   - Updated `create()` to validate preferences before order creation
   - Checks severe allergen conflicts and diet mismatches
   - Returns 409 Conflict if issues found and override=false
   - Stores preferenceSnapshot and overrideAccepted with order

### Routes (1 file)
7. **`services/users/routes.js`**
   - Added `GET /preferences/me` (auth required)
   - Added `PUT /preferences/me` (auth required)

### Scripts (2 files)
8. **`scripts/migrate-preferences.js`** - Automated migration script
9. **`scripts/test-preferences.js`** - Comprehensive test script

### Documentation (2 files)
10. **`PREFERENCES_IMPLEMENTATION.md`** - Full implementation details
11. **`PREFERENCES_SUMMARY.md`** - This file

## 🚀 Migration Commands

### Quick Start (Recommended)
```bash
node scripts/migrate-preferences.js
```

### Manual Migration
```bash
# Generate Prisma clients
npx prisma generate --schema=prisma/schema-auth.prisma
npx prisma generate --schema=prisma/schema-orders.prisma

# Run migrations
npx prisma migrate dev --schema=prisma/schema-auth.prisma --name add_user_preferences
npx prisma migrate dev --schema=prisma/schema-orders.prisma --name add_preference_tracking
```

## 🧪 How to Test

### Automated Testing
```bash
# Start services first
node scripts/start-all-services.js

# Run preference tests
node scripts/test-preferences.js
```

### Manual API Testing

#### 1. Authenticate and get token
```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15555551234"}'

curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15555551234", "otp": "RECEIVED_OTP"}'
```

#### 2. Set preferences
```bash
curl -X PUT http://localhost:3000/api/v1/users/preferences/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dietTags": ["vegan", "gluten_free_pref"],
    "allergens": ["peanuts", "dairy"],
    "allergenSeverity": "severe",
    "avoidCrossContact": true,
    "spiceLevel": 2,
    "tasteLikes": ["spicy"],
    "tasteDislikes": ["sweet"]
  }'
```

#### 3. Get preferences
```bash
curl -X GET http://localhost:3000/api/v1/users/preferences/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Check meal compatibility
```bash
curl -X GET http://localhost:3000/api/v1/menu/MEAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response includes:
```json
{
  "compatibility": {
    "compatible": false,
    "reasons": ["contains_allergen:dairy", "diet_not_matched:vegan"]
  }
}
```

#### 5. Create order (will return 409 if conflicts)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"mealId": "MEAL_ID", "quantity": 2}],
    "deliveryAddress": {"street": "123 Main St", "city": "SF", "state": "CA", "zipCode": "94102"},
    "deliveryDate": "2024-12-25T18:00:00Z",
    "deliveryTime": "18:00",
    "override": false
  }'
```

#### 6. Create order with override
```bash
# Same as above but with "override": true
```

## 📊 Valid Enum Values

### Diet Tags
- keto
- pescatarian
- vegan
- vegetarian
- gluten_free_pref
- halal_pref
- low_sodium_pref

### Allergens
- peanuts
- tree_nuts
- shellfish
- fish
- dairy
- eggs
- wheat_gluten
- soy
- sesame
- other

### Allergen Severity
- mild
- severe

### Spice Level
- 0, 1, 2, or 3

## 🔒 Security & Validation

- All preference endpoints require authentication (JWT with userId)
- Unknown enum values are rejected with 400 error
- Spice level validated to be 0-3
- Arrays validated for correct type
- Severe allergen conflicts block orders unless override=true
- Diet mismatches block orders unless override=true

## 📝 Pattern Compliance

✅ Matches existing repo patterns:
- Uses Prisma split clients (auth, orders, cooks)
- Follows routes/controllers structure
- Uses express-validator for validation
- Uses shared middleware (auth, errorHandler)
- Follows BullMQ event pattern (ready for integration)
- Consistent error handling with AppError

## 🎯 Next Steps

1. Run migrations: `node scripts/migrate-preferences.js`
2. Restart services: `node scripts/start-all-services.js`
3. Test API: `node scripts/test-preferences.js`
4. Integrate with frontend
5. Add BullMQ events for preference changes (optional)

