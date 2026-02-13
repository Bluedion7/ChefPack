# 🍳 Kitchen Verification - Quick Start Guide

## 🚀 **One-Command Startup**

### **Windows (PowerShell)**
```powershell
.\scripts\start-kitchen-verification.ps1
```

### **Windows (Command Prompt)**
```cmd
scripts\start-kitchen-verification.bat
```

This will:
1. ✅ Check Docker is running
2. ✅ Start all databases (PostgreSQL + Redis)
3. ✅ Run migrations
4. ✅ Start all services (Admin, Cooks, Orders, API Gateway)
5. ✅ Display service URLs

---

## 📋 **Manual Setup**

### **Step 1: Start Docker Desktop**
Make sure Docker Desktop is running (whale icon in system tray)

### **Step 2: Start Databases**
```bash
docker-compose up -d postgres-auth postgres-orders postgres-payments postgres-cooks redis
```

### **Step 3: Run Migrations**
```bash
node scripts/migrate-kitchen-verification.js
```

### **Step 4: Start Services**
```bash
# Terminal 1 - Admin Service
node services/admin/index.js

# Terminal 2 - Cooks Service
node services/cooks/index.js

# Terminal 3 - Orders Service
node services/orders/index.js

# Terminal 4 - API Gateway
node services/api-gateway/index.js
```

---

## 🧪 **Testing**

### **Run Test Script**
```bash
node scripts/test-kitchen-verification.js
```

### **Manual API Testing**

#### **1. Cook Submits Kitchen Info**
```bash
curl -X PUT http://localhost:3003/api/v1/kitchen/submit \
  -H "Authorization: Bearer <cook-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "kitchenAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102"
    },
    "kitchenDocs": {
      "healthPermit": "https://example.com/permit.pdf",
      "insuranceCert": "https://example.com/insurance.pdf"
    }
  }'
```

#### **2. Admin Lists Pending**
```bash
curl http://localhost:3016/api/v1/kitchen-verifications/pending \
  -H "Authorization: Bearer <admin-token>"
```

#### **3. Admin Approves**
```bash
curl -X POST http://localhost:3016/api/v1/kitchen-verifications/<cookId>/approve \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🔗 **Service URLs**

| Service | URL | Health Check |
|---------|-----|--------------|
| API Gateway | http://localhost:3000 | http://localhost:3000/healthz |
| Admin Service | http://localhost:3016 | http://localhost:3016/healthz |
| Cooks Service | http://localhost:3003 | http://localhost:3003/healthz |
| Orders Service | http://localhost:3006 | http://localhost:3006/healthz |

---

## 🗄️ **Database Ports**

| Database | Port | Connection String |
|----------|------|-------------------|
| Auth DB | 5432 | postgresql://postgres:ChefPack2024!Secure@localhost:5432/chefpack_auth |
| Orders DB | 5433 | postgresql://postgres:ChefPack2024!Secure@localhost:5433/chefpack_orders |
| Payments DB | 5434 | postgresql://postgres:ChefPack2024!Secure@localhost:5434/chefpack_payments |
| Cooks DB | 5435 | postgresql://postgres:ChefPack2024!Secure@localhost:5435/chefpack_cooks |
| Redis | 6379 | redis://localhost:6379 |

---

## 📊 **API Endpoints**

### **Cook Endpoints**
- `PUT /api/v1/cooks/kitchen/submit` - Submit kitchen info
- `GET /api/v1/cooks/kitchen/status` - Check verification status

### **Admin Endpoints**
- `GET /api/v1/admin/kitchen-verifications/pending` - List pending
- `GET /api/v1/admin/kitchen-verifications/verified` - List verified
- `POST /api/v1/admin/kitchen-verifications/:cookId/approve` - Approve
- `POST /api/v1/admin/kitchen-verifications/:cookId/reject` - Reject

---

## 🔐 **Authentication**

All endpoints require JWT authentication:
```
Authorization: Bearer <jwt-token>
```

**Roles:**
- **Cook** - Can submit and check own kitchen status
- **Admin** - Can approve/reject verifications
- **Support** - Can view pending/verified lists

---

## 📝 **Documentation**

- **Full Implementation Details**: `KITCHEN_VERIFICATION_IMPLEMENTATION.md`
- **Quick Summary**: `KITCHEN_VERIFICATION_SUMMARY.md`
- **Complete Guide**: `KITCHEN_VERIFICATION_COMPLETE.md`

---

## ❓ **Troubleshooting**

### **Docker not running**
```
Error: Cannot connect to Docker daemon
```
**Solution**: Start Docker Desktop

### **Port already in use**
```
Error: Port 3016 is already in use
```
**Solution**: Kill the process or change port in `.env`

### **Database connection failed**
```
Error: Can't reach database server
```
**Solution**: Wait 15 seconds for databases to initialize, then retry

### **Migration failed**
```
Error: Migration already applied
```
**Solution**: This is normal if migrations were already run

---

## 🎉 **Success!**

If all services show `status: 'ok'` at their health check endpoints, you're ready to go!

**Next Steps:**
1. Run test script: `node scripts/test-kitchen-verification.js`
2. Integrate with frontend
3. Add BullMQ event notifications
4. Deploy to production

---

**Need Help?** Check the full documentation in `KITCHEN_VERIFICATION_IMPLEMENTATION.md`

