# Customer Preference Profile Implementation

## Overview
Complete implementation of customer dietary preferences, allergen tracking, and meal compatibility checking for the ChefPack platform (USA-only).

## Changes Summary

### 1. Database Schema Changes

#### Auth Database (`prisma/schema-auth.prisma`)
- **Added `UserPreference` model** (1:1 with User)
  - `dietTags`: Array of diet preferences (keto, pescatarian, vegan, vegetarian, gluten_free_pref, halal_pref, low_sodium_pref)
  - `allergens`: Array of allergens (peanuts, tree_nuts, shellfish, fish, dairy, eggs, wheat_gluten, soy, sesame, other)
  - `allergenOtherText`: Optional text for "other" allergen specification
  - `allergenSeverity`: Enum (mild, severe)
  - `avoidCrossContact`: Boolean flag
  - `spiceLevel`: Integer 0-3
  - `tasteLikes`: Array of taste preferences
  - `tasteDislikes`: Array of taste dislikes
  - Timestamps: createdAt, updatedAt

- **Added `AllergenSeverity` enum**: mild, severe

- **Updated `User` model**: Added `preference` relation

#### Orders Database (`prisma/schema-orders.prisma`)
- **Updated `Order` model**:
  - `preferenceSnapshot`: JSON field storing user preferences at order time
  - `overrideAccepted`: Boolean indicating user accepted allergen/diet warnings

### 2. Auth Service Changes (`services/auth/`)

#### `controller.js`
- Added Prisma Auth client import
- **Updated `verifyOTP` function**:
  - Upserts User by phone number
  - Includes `userId` in JWT payload (required for all authenticated requests)
  - Returns userId in response

### 3. Users Service Changes (`services/users/`)

#### `controller.js`
- Added Prisma Auth client import
- Added validation constants for diet tags, allergens, and severity
- **New `getPreferences` function**: GET /preferences/me
  - Returns user's current preferences
  - Requires authentication
- **New `updatePreferences` function**: PUT /preferences/me
  - Validates all enum values against allowed lists
  - Rejects unknown diet tags and allergens
  - Validates spiceLevel range (0-3)
  - Upserts preferences for authenticated user

#### `routes.js`
- Added preference routes:
  - `GET /preferences/me` (auth required)
  - `PUT /preferences/me` (auth required)

### 4. Menu Service Changes (`services/menu/`)

#### `controller.js`
- Added Prisma Cooks and Auth client imports
- **Updated `getById` function**:
  - Checks for Authorization header
  - If present, fetches user preferences
  - Calculates meal compatibility
  - Returns compatibility object with meal details
- **New `checkMealCompatibility` helper**:
  - Checks allergen conflicts
  - Checks diet tag mismatches
  - Returns `{ compatible: boolean, reasons: string[] }`
  - Reason format: `contains_allergen:dairy`, `diet_not_matched:vegan`

### 5. Orders Service Changes (`services/orders/`)

#### `controller.js`
- Added Prisma Orders, Auth, and Cooks client imports
- **Updated `create` function**:
  - Fetches user preferences before order creation
  - Fetches all meals in order
  - Checks for conflicts:
    - **Severe allergen conflicts**: Blocks order if allergenSeverity is "severe"
    - **Diet mismatches**: Blocks order if meal doesn't match diet tags
  - Returns 409 Conflict if issues found and `override=false`
  - Accepts `override=true` to bypass warnings
  - Stores `preferenceSnapshot` and `overrideAccepted` with order

## Migration Commands

### Run migrations and generate clients:
```bash
node scripts/migrate-preferences.js
```

### Or manually:
```bash
# Generate Prisma clients
npx prisma generate --schema=prisma/schema-auth.prisma
npx prisma generate --schema=prisma/schema-orders.prisma

# Run migrations
npx prisma migrate dev --schema=prisma/schema-auth.prisma --name add_user_preferences
npx prisma migrate dev --schema=prisma/schema-orders.prisma --name add_preference_tracking
```

## Testing

### Automated test:
```bash
node scripts/test-preferences.js
```

### Manual API testing:

#### 1. Authenticate
```bash
# Send OTP
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15555551234"}'

# Verify OTP (use OTP from response in dev mode)
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15555551234", "otp": "123456"}'
```

#### 2. Set Preferences
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

#### 3. Get Preferences
```bash
curl -X GET http://localhost:3000/api/v1/users/preferences/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Check Meal Compatibility
```bash
curl -X GET http://localhost:3000/api/v1/menu/MEAL_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response includes:
```json
{
  "compatibility": {
    "compatible": false,
    "reasons": ["contains_allergen:dairy", "diet_not_matched:vegan"]
  }
}
```

#### 5. Create Order (will fail if conflicts exist)
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"mealId": "MEAL_ID", "quantity": 2}],
    "deliveryAddress": {...},
    "deliveryDate": "2024-12-25T18:00:00Z",
    "deliveryTime": "18:00",
    "override": false
  }'
```

Returns 409 if conflicts exist.

#### 6. Create Order with Override
```bash
# Same as above but with "override": true
```

## Files Changed

1. `prisma/schema-auth.prisma` - Added UserPreference model
2. `prisma/schema-orders.prisma` - Added preference tracking fields
3. `services/auth/controller.js` - User upsert and userId in JWT
4. `services/users/controller.js` - Preference CRUD operations
5. `services/users/routes.js` - Preference routes
6. `services/menu/controller.js` - Compatibility checking
7. `services/orders/controller.js` - Preference validation on order creation
8. `scripts/migrate-preferences.js` - Migration automation script
9. `scripts/test-preferences.js` - Comprehensive test script

## Validation Rules

- **Diet Tags**: Must be one of: keto, pescatarian, vegan, vegetarian, gluten_free_pref, halal_pref, low_sodium_pref
- **Allergens**: Must be one of: peanuts, tree_nuts, shellfish, fish, dairy, eggs, wheat_gluten, soy, sesame, other
- **Allergen Severity**: Must be "mild" or "severe"
- **Spice Level**: Must be integer 0-3
- **All arrays**: Must be valid JSON arrays

## Error Handling

- 400: Invalid enum values or validation errors
- 401: Missing or invalid authentication token
- 404: Meal not found
- 409: Order conflicts with preferences (requires override)

