# Customer Preferences API Reference

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All preference endpoints require JWT authentication:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Endpoints

### 1. Get User Preferences
**GET** `/users/preferences/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "dietTags": ["vegan", "gluten_free_pref"],
    "allergens": ["peanuts", "dairy"],
    "allergenOtherText": null,
    "allergenSeverity": "severe",
    "avoidCrossContact": true,
    "spiceLevel": 2,
    "tasteLikes": ["spicy", "savory"],
    "tasteDislikes": ["sweet"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response 200 (No preferences set):**
```json
{
  "success": true,
  "data": null,
  "message": "No preferences set"
}
```

---

### 2. Update User Preferences
**PUT** `/users/preferences/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "dietTags": ["vegan", "gluten_free_pref"],
  "allergens": ["peanuts", "dairy"],
  "allergenOtherText": "Specific allergy details",
  "allergenSeverity": "severe",
  "avoidCrossContact": true,
  "spiceLevel": 2,
  "tasteLikes": ["spicy", "savory"],
  "tasteDislikes": ["sweet"]
}
```

**Valid Values:**
- `dietTags`: ["keto", "pescatarian", "vegan", "vegetarian", "gluten_free_pref", "halal_pref", "low_sodium_pref"]
- `allergens`: ["peanuts", "tree_nuts", "shellfish", "fish", "dairy", "eggs", "wheat_gluten", "soy", "sesame", "other"]
- `allergenSeverity`: "mild" | "severe"
- `spiceLevel`: 0 | 1 | 2 | 3
- `avoidCrossContact`: boolean
- `tasteLikes`: string[]
- `tasteDislikes`: string[]

**Response 200:**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": { /* updated preference object */ }
}
```

**Response 400 (Validation Error):**
```json
{
  "success": false,
  "message": "Invalid diet tag. Valid values: keto, pescatarian, vegan, ..."
}
```

---

### 3. Get Meal with Compatibility Check
**GET** `/menu/:mealId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN (optional, but required for compatibility check)
```

**Response 200 (With Auth):**
```json
{
  "success": true,
  "data": {
    "id": "meal-uuid",
    "name": "Vegan Buddha Bowl",
    "description": "...",
    "price": 12.99,
    "allergens": ["soy", "sesame"],
    "dietaryTags": ["vegan", "gluten-free"],
    "compatibility": {
      "compatible": false,
      "reasons": [
        "contains_allergen:soy",
        "diet_not_matched:keto"
      ]
    }
  }
}
```

**Response 200 (Without Auth):**
```json
{
  "success": true,
  "data": {
    "id": "meal-uuid",
    "name": "Vegan Buddha Bowl",
    "description": "...",
    "price": 12.99,
    "allergens": ["soy", "sesame"],
    "dietaryTags": ["vegan", "gluten-free"]
    // No compatibility field
  }
}
```

---

### 4. Create Order with Preference Validation
**POST** `/orders`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "mealId": "meal-uuid",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102"
  },
  "deliveryDate": "2024-12-25T18:00:00Z",
  "deliveryTime": "18:00",
  "specialInstructions": "Ring doorbell",
  "override": false
}
```

**Response 201 (Success):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "preferenceSnapshot": { /* user preferences at order time */ },
    "overrideAccepted": false,
    "items": [...]
  }
}
```

**Response 409 (Conflicts Found):**
```json
{
  "success": false,
  "message": "Order contains items that conflict with your dietary preferences",
  "conflicts": [
    {
      "mealId": "meal-uuid",
      "mealName": "Chicken Parmesan",
      "type": "severe_allergen",
      "details": ["dairy", "wheat_gluten"]
    },
    {
      "mealId": "meal-uuid-2",
      "mealName": "Beef Stir Fry",
      "type": "diet_mismatch",
      "details": ["vegan"]
    }
  ],
  "requiresOverride": true
}
```

**To bypass conflicts, set `"override": true` in request body**

---

## Error Codes

- **400** - Bad Request (validation errors, invalid enum values)
- **401** - Unauthorized (missing or invalid token)
- **404** - Not Found (meal not found)
- **409** - Conflict (order conflicts with preferences, requires override)

---

## Example Workflow

```bash
# 1. Authenticate
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+15555551234", "otp": "123456"}' | jq -r '.data.accessToken')

# 2. Set preferences
curl -X PUT http://localhost:3000/api/v1/users/preferences/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dietTags": ["vegan"], "allergens": ["dairy"], "allergenSeverity": "severe"}'

# 3. Check meal compatibility
curl -X GET http://localhost:3000/api/v1/menu/MEAL_ID \
  -H "Authorization: Bearer $TOKEN"

# 4. Create order (will fail if conflicts)
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"mealId": "MEAL_ID", "quantity": 1}], "deliveryAddress": {...}, "override": false}'

# 5. Create order with override
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"mealId": "MEAL_ID", "quantity": 1}], "deliveryAddress": {...}, "override": true}'
```

