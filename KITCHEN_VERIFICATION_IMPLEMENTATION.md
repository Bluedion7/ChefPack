# Kitchen Verification & Pickup Implementation

## 🎯 Overview

This implementation adds **Cook Kitchen Verification** and **Kitchen Pickup** functionality to the ChefPack microservices platform. Cooks must have verified kitchens before customers can order from them, and orders store kitchen pickup snapshots for ShipPack delivery integration.

---

## 📋 Files Changed

### **Schema Changes (2 files)**

1. **`prisma/schema-cooks.prisma`**
   - Added kitchen verification fields to `Cook` model:
     - `kitchenVerified` (Boolean) - Verification status
     - `kitchenAddress` (Json) - Kitchen location details
     - `kitchenDocs` (Json) - Health permit, insurance, photos
     - `kitchenVerifiedAt` (DateTime) - Approval timestamp
     - `kitchenRejectedReason` (String) - Rejection reason
   - Added index on `kitchenVerified` for fast queries

2. **`prisma/schema-orders.prisma`**
   - Added `kitchenPickupSnapshot` (Json) to `Order` model
   - Stores cook's kitchen address at order time for ShipPack pickup

### **Cooks Service (2 files)**

3. **`services/cooks/controller.js`**
   - Added Prisma Cooks client
   - New `submitKitchen()` function - Validates and stores kitchen info
   - New `getKitchenStatus()` function - Returns verification status

4. **`services/cooks/routes.js`**
   - Added `PUT /kitchen/submit` - Cook submits kitchen info
   - Added `GET /kitchen/status` - Cook checks verification status

### **Admin Service (4 files - NEW SERVICE)**

5. **`services/admin/index.js`** - New Express service on port 3016
6. **`services/admin/controller.js`** - Admin verification logic
   - `getPendingKitchenVerifications()` - List pending verifications
   - `getVerifiedKitchens()` - List all verified kitchens
   - `approveKitchenVerification()` - Approve kitchen
   - `rejectKitchenVerification()` - Reject kitchen with reason

7. **`services/admin/routes.js`** - Admin routes with RBAC
   - All routes require `ADMIN` or `SUPPORT` role
   - Approval/rejection requires `ADMIN` role only

8. **`services/admin/Dockerfile`** - Docker configuration

### **Orders Service (1 file)**

9. **`services/orders/controller.js`**
   - Modified `create()` function to:
     - Fetch meals with cook's `kitchenVerified` status
     - Reject orders if cook's kitchen is not verified
     - Create `kitchenPickupSnapshot` with cook's kitchen address
     - Store snapshot in order for ShipPack pickup

### **API Gateway (1 file)**

10. **`services/api-gateway/index.js`**
    - Added admin service route: `/api/v1/admin` → `http://localhost:3016`

### **Scripts (2 files)**

11. **`scripts/migrate-kitchen-verification.js`** - Automated migration script
12. **`scripts/test-kitchen-verification.js`** - Comprehensive test script

---

## 🗄️ Database Migrations

### **Run Migrations**

```bash
# Generate Prisma clients
npx prisma generate --schema=prisma/schema-cooks.prisma
npx prisma generate --schema=prisma/schema-orders.prisma

# Run migrations
npx prisma migrate dev --schema=prisma/schema-cooks.prisma --name add_kitchen_verification
npx prisma migrate dev --schema=prisma/schema-orders.prisma --name add_kitchen_pickup_snapshot
```

### **Or use the automated script:**

```bash
node scripts/migrate-kitchen-verification.js
```

---

## 🚀 How to Test

### **1. Start Services**

```bash
# Start all services
npm run docker:up

# Or start individually
node services/cooks/index.js    # Port 3003
node services/admin/index.js    # Port 3016
node services/orders/index.js   # Port 3006
node services/api-gateway/index.js  # Port 3000
```

### **2. Run Test Script**

```bash
node scripts/test-kitchen-verification.js
```

### **3. Manual Testing**

#### **Cook: Submit Kitchen Info**
```bash
PUT /api/v1/cooks/kitchen/submit
Authorization: Bearer <cook-jwt-token>

{
  "kitchenAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "kitchenDocs": {
    "healthPermit": "https://example.com/health-permit.pdf",
    "insuranceCert": "https://example.com/insurance.pdf",
    "photos": ["https://example.com/kitchen1.jpg"]
  }
}
```

#### **Cook: Check Status**
```bash
GET /api/v1/cooks/kitchen/status
Authorization: Bearer <cook-jwt-token>
```

#### **Admin: List Pending Verifications**
```bash
GET /api/v1/admin/kitchen-verifications/pending?limit=50&offset=0
Authorization: Bearer <admin-jwt-token>
```

#### **Admin: Approve Kitchen**
```bash
POST /api/v1/admin/kitchen-verifications/:cookId/approve
Authorization: Bearer <admin-jwt-token>
```

#### **Admin: Reject Kitchen**
```bash
POST /api/v1/admin/kitchen-verifications/:cookId/reject
Authorization: Bearer <admin-jwt-token>

{
  "reason": "Health permit expired. Please upload a current permit."
}
```

#### **Customer: Create Order (requires verified kitchen)**
```bash
POST /api/v1/orders
Authorization: Bearer <customer-jwt-token>

{
  "items": [
    { "mealId": "meal-123", "quantity": 2 }
  ],
  "deliveryAddress": { ... },
  "deliveryDate": "2024-01-15",
  "deliveryTime": "18:00"
}
```

---

## 🔐 Role-Based Access Control

- **Cook Endpoints** - Require `authMiddleware` (any authenticated user)
- **Admin List Endpoints** - Require `ADMIN` or `SUPPORT` role
- **Admin Approve/Reject** - Require `ADMIN` role only

---

## 📊 Data Structures

### **Kitchen Address (JSON)**
```json
{
  "street": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

### **Kitchen Docs (JSON)**
```json
{
  "healthPermit": "https://example.com/health-permit.pdf",
  "insuranceCert": "https://example.com/insurance.pdf",
  "photos": [
    "https://example.com/kitchen1.jpg",
    "https://example.com/kitchen2.jpg"
  ]
}
```

### **Kitchen Pickup Snapshot (JSON)**
```json
{
  "cookId": "cook-uuid",
  "businessName": "Chef John's Kitchen",
  "kitchenAddress": { ... },
  "snapshotAt": "2024-01-15T10:30:00Z"
}
```

---

## 🔄 Integration with ShipPack

When dispatching delivery, the `kitchenPickupSnapshot` in the order contains:
- Cook's kitchen address (for pickup location)
- Business name (for driver identification)
- Snapshot timestamp (for audit trail)

This snapshot is immutable and represents the kitchen address at order time, even if the cook later updates their kitchen address.

---

## ✅ Success Criteria

- ✅ Cooks can submit kitchen info with address and documents
- ✅ Admins can list pending verifications
- ✅ Admins can approve/reject verifications
- ✅ Orders require verified kitchens (returns 400 error if not verified)
- ✅ Orders store kitchen pickup snapshot for ShipPack
- ✅ All endpoints follow existing patterns (Express, Prisma, BullMQ)
- ✅ RBAC enforced on admin endpoints

---

## 🎉 Implementation Complete!

All changes follow existing ChefPack patterns and are production-ready.

