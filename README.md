# ChefPack Microservices Backend

A complete microservices architecture for the ChefPack platform, featuring 15 independent services with event-driven communication.

## 🏗️ Architecture

### Services
- **API Gateway** (Port 3000) - Entry point, routing, rate limiting
- **Auth Service** (Port 3001) - OTP authentication, JWT tokens
- **Users Service** (Port 3002) - User profiles, RBAC
- **Cooks Service** (Port 3003) - Cook onboarding, availability
- **Menu Service** (Port 3004) - Meals, dietary restrictions
- **Plans Service** (Port 3005) - Subscription plans
- **Orders Service** (Port 3006) - Order lifecycle, SLA
- **Matching Service** (Port 3007) - Cook-order assignment
- **Ingredients Service** (Port 3008) - Ingredient lists
- **Dispatch Service** (Port 3009) - ShipPack integration
- **Payments Service** (Port 3010) - Stripe integration
- **Payouts Service** (Port 3011) - Cook earnings
- **Notifications Service** (Port 3012) - SMS, Email, Push
- **Support Service** (Port 3013) - Disputes, tickets
- **Ratings Service** (Port 3014) - Reviews and ratings
- **Webhook Service** (Port 3015) - External webhooks

### Infrastructure
- **4 PostgreSQL Databases** - Separate DBs per domain
- **Redis** - Caching, rate limiting, sessions
- **BullMQ** - Event bus and job queue
- **Meilisearch** - Full-text search
- **Cloudflare** - CDN and WAF

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start infrastructure with Docker**
```bash
npm run docker:up
```

4. **Run database migrations**
```bash
npm run migrate
```

5. **Start API Gateway**
```bash
npm start
```

6. **Start individual services (in separate terminals)**
```bash
npm run dev:auth
npm run dev:users
npm run dev:cooks
npm run dev:menu
npm run dev:orders
npm run dev:payments
```

## 📝 Configuration

All configuration is in `.env.example`. Key sections:

### Databases
- `DATABASE_AUTH_URL` - Auth & Users DB
- `DATABASE_ORDERS_URL` - Orders DB
- `DATABASE_PAYMENTS_URL` - Payments DB
- `DATABASE_COOKS_URL` - Cooks, Menu, Plans DB

### External Services
- **AWS SNS** - SMS notifications
- **AWS SES** - Email notifications
- **Firebase FCM** - Push notifications
- **Stripe** - Payment processing
- **ShipPack** - Delivery API
- **Sentry** - Error monitoring

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Smoke tests
node scripts/smoke-test.js
```

## 🐳 Docker

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild services
docker-compose up -d --build
```

## 📊 Health Checks

Each service exposes a health endpoint:
- Gateway: http://localhost:3000/healthz
- Auth: http://localhost:3001/healthz
- Users: http://localhost:3002/healthz
- etc.

## 🔐 Authentication

1. **Send OTP**
```bash
POST /api/v1/auth/send-otp
{
  "phone": "+1234567890"
}
```

2. **Verify OTP**
```bash
POST /api/v1/auth/verify-otp
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

3. **Use Access Token**
```bash
Authorization: Bearer <access_token>
```

## 📡 Event Bus

Services communicate via BullMQ events:
- `order.created`
- `order.assigned`
- `payment.completed`
- `delivery.updated`
- etc.

## 🛠️ Development

### Generate New Service
```bash
# Edit scripts/generate-services.js
npm run generate-services
```

### Service Structure
```
services/
  service-name/
    index.js       # Entry point
    routes.js      # API routes
    controller.js  # Business logic
    Dockerfile     # Container config
```

## 📚 API Documentation

API docs available at:
- Swagger: http://localhost:3000/docs (TODO)
- Postman Collection: `./docs/postman-collection.json` (TODO)

## 🔧 Troubleshooting

### Services won't start
- Check Docker containers: `docker ps`
- Check logs: `npm run docker:logs`
- Verify .env configuration

### Database connection errors
- Ensure PostgreSQL containers are running
- Check DATABASE_*_URL values
- Run migrations: `npm run migrate`

### Redis connection errors
- Verify Redis container: `docker ps | grep redis`
- Check REDIS_URL in .env

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Use proper secrets (not placeholders)
3. Enable SSL/TLS
4. Configure Cloudflare CDN
5. Set up monitoring (Sentry)
6. Configure auto-scaling
7. Set up CI/CD pipeline

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit PR

## 📄 License

ISC

