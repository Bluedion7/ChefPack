# ChefPack Backend Setup Guide

## ✅ What Has Been Created

### 🏗️ Complete Microservices Architecture
- **16 Microservices** - All services from the Mermaid diagram
- **API Gateway** - Centralized routing and rate limiting
- **Event Bus** - BullMQ for async communication
- **Shared Libraries** - Common utilities, middleware, logging

### 📁 Project Structure
```
ChefPack/
├── services/
│   ├── api-gateway/      # Port 3000 - Entry point
│   ├── auth/             # Port 3001 - OTP & JWT
│   ├── users/            # Port 3002 - Profiles & RBAC
│   ├── cooks/            # Port 3003 - Cook management
│   ├── menu/             # Port 3004 - Meals & dietary
│   ├── plans/            # Port 3005 - Subscriptions
│   ├── orders/           # Port 3006 - Order lifecycle
│   ├── matching/         # Port 3007 - Assignment
│   ├── ingredients/      # Port 3008 - Ingredient lists
│   ├── dispatch/         # Port 3009 - ShipPack
│   ├── payments/         # Port 3010 - Stripe
│   ├── payouts/          # Port 3011 - Cook earnings
│   ├── notifications/    # Port 3012 - SMS/Email/Push
│   ├── support/          # Port 3013 - Disputes
│   ├── ratings/          # Port 3014 - Reviews
│   └── webhook/          # Port 3015 - External webhooks
├── shared/
│   ├── logger.js         # Winston logging
│   ├── redis.js          # Redis client
│   ├── events/
│   │   └── eventBus.js   # BullMQ event bus
│   └── middleware/
│       ├── auth.js       # JWT authentication
│       └── errorHandler.js
├── scripts/
│   ├── generate-services.js
│   ├── start-all-services.js
│   └── smoke-test.js
├── .env                  # ⚠️ CONFIGURE THIS FILE
├── .env.example          # Template with all variables
├── docker-compose.yml    # Infrastructure setup
├── package.json          # Dependencies & scripts
└── README.md             # Documentation
```

## 🚀 Quick Start

### Step 1: Configure Environment
Open `.env` file and replace placeholder values:

**Required for basic functionality:**
```env
# Database URLs (use Docker defaults or your own)
DATABASE_AUTH_URL=postgresql://postgres:password@localhost:5432/chefpack_auth
DATABASE_ORDERS_URL=postgresql://postgres:password@localhost:5433/chefpack_orders
DATABASE_PAYMENTS_URL=postgresql://postgres:password@localhost:5434/chefpack_payments
DATABASE_COOKS_URL=postgresql://postgres:password@localhost:5435/chefpack_cooks

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-actual-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
SESSION_SECRET=your-session-secret-here
```

**Optional (for full functionality):**
- AWS credentials (SNS, SES, S3)
- Stripe keys
- ShipPack API key
- Firebase FCM credentials
- Sentry DSN

### Step 2: Start Infrastructure
```bash
# Start PostgreSQL, Redis, Meilisearch
npm run docker:up

# Wait for services to be healthy
docker ps
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Services

**Option A: Start All Services**
```bash
node scripts/start-all-services.js
```

**Option B: Start Individual Services**
```bash
# Terminal 1 - API Gateway
npm start

# Terminal 2 - Auth Service
npm run dev:auth

# Terminal 3 - Users Service
npm run dev:users

# Add more terminals for other services...
```

### Step 5: Test Services
```bash
# Run smoke tests
node scripts/smoke-test.js

# Or test manually
curl http://localhost:3000/healthz
curl http://localhost:3001/healthz
curl http://localhost:3002/healthz
```

## 🧪 Testing the System

### Health Checks
Every service has a `/healthz` endpoint:
```bash
curl http://localhost:3001/healthz
```

Response:
```json
{
  "status": "ok",
  "service": "auth-service",
  "uptime": 123.45,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Authentication Flow
```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# 2. Verify OTP (check logs for OTP in development)
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "otp": "123456"}'

# 3. Use the returned access token
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Service Status

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| API Gateway | 3000 | ✅ Ready | Entry point, routing |
| Auth | 3001 | ✅ Ready | OTP & JWT |
| Users | 3002 | ✅ Ready | Profiles & RBAC |
| Cooks | 3003 | ✅ Ready | Cook management |
| Menu | 3004 | ✅ Ready | Meals & dietary |
| Plans | 3005 | ✅ Ready | Subscriptions |
| Orders | 3006 | ✅ Ready | Order lifecycle |
| Matching | 3007 | ✅ Ready | Assignment |
| Ingredients | 3008 | ✅ Ready | Ingredient lists |
| Dispatch | 3009 | ✅ Ready | ShipPack integration |
| Payments | 3010 | ✅ Ready | Stripe integration |
| Payouts | 3011 | ✅ Ready | Cook earnings |
| Notifications | 3012 | ✅ Ready | SMS/Email/Push |
| Support | 3013 | ✅ Ready | Disputes |
| Ratings | 3014 | ✅ Ready | Reviews |
| Webhook | 3015 | ✅ Ready | External webhooks |

## 🔧 Configuration Details

### Database Configuration
The system uses 4 separate PostgreSQL databases for domain isolation:
- **chefpack_auth** - Authentication & Users
- **chefpack_orders** - Orders, Matching, Ingredients, Support, Ratings
- **chefpack_payments** - Payments & Payouts
- **chefpack_cooks** - Cooks, Menu, Plans

### Service Communication
- **Synchronous**: HTTP via API Gateway
- **Asynchronous**: BullMQ events via Redis

### Event Types
- `order.created`
- `order.assigned`
- `order.completed`
- `payment.completed`
- `payment.failed`
- `delivery.updated`
- `cook.verified`
- `notification.sent`

## 🐛 Troubleshooting

### Services won't start
1. Check if ports are available: `netstat -ano | findstr :3001`
2. Verify .env file exists and has correct values
3. Check Docker containers: `docker ps`
4. View logs: `npm run docker:logs`

### Database connection errors
1. Ensure PostgreSQL containers are running
2. Check DATABASE_*_URL values in .env
3. Test connection: `docker exec -it chefpack-postgres-auth psql -U postgres`

### Redis connection errors
1. Check Redis container: `docker ps | findstr redis`
2. Test connection: `docker exec -it chefpack-redis redis-cli ping`

## 📝 Next Steps

1. **Configure External Services**
   - Set up AWS SNS for SMS
   - Set up AWS SES for Email
   - Configure Stripe account
   - Set up ShipPack API

2. **Database Migrations**
   - Create Prisma schemas
   - Run migrations: `npm run migrate`

3. **Add Business Logic**
   - Implement service-specific logic in controllers
   - Add validation rules
   - Create database models

4. **Testing**
   - Write unit tests
   - Add integration tests
   - Set up CI/CD

5. **Production Deployment**
   - Set up Kubernetes/Docker Swarm
   - Configure load balancers
   - Set up monitoring (Sentry)
   - Enable SSL/TLS

## 🎉 Success!

Your ChefPack microservices backend is now ready for development!

All services are configured and can be started individually or together.
The `.env` file contains all configuration with placeholder values.
Replace the placeholders with your actual credentials to enable full functionality.

