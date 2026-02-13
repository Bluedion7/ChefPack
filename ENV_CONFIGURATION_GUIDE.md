# .env Configuration Guide

## ✅ What Has Been Filled In

Your `.env` file has been populated with realistic values and best practices. Here's what you need to know:

---

## 🟢 READY TO USE (No Changes Needed)

These values are configured and ready for local development:

### Database URLs
- ✅ All 4 PostgreSQL databases configured with secure password
- ✅ Password: `ChefPack2024!Secure`
- ✅ Ports: 5432, 5433, 5434, 5435

### Redis
- ✅ Configured for localhost:6379
- ✅ No password (local development)

### Meilisearch
- ✅ Configured for localhost:7700
- ✅ Master key: `ChefPackMeiliSearch2024SecureKey`

### JWT & Authentication
- ✅ Strong 64-byte hex secrets generated
- ✅ JWT expires in 7 days
- ✅ Refresh token expires in 30 days
- ✅ OTP expires in 10 minutes

### Service Ports & URLs
- ✅ All 16 microservices configured (ports 3000-3015)
- ✅ Internal service URLs set for localhost

### CORS
- ✅ Multiple origins configured
- ✅ Includes localhost:3000, 3001, 4200
- ✅ Production domains added

### Application Settings
- ✅ Order timing configured
- ✅ Platform commission: 15%
- ✅ Minimum order: $10
- ✅ Delivery fee: $5
- ✅ Currency: USD

### Feature Flags
- ✅ Subscriptions: Enabled
- ✅ Ratings: Enabled
- ✅ Live tracking: Enabled
- ✅ Loyalty program: Disabled (can enable later)

### Security Settings
- ✅ Bcrypt rounds: 12
- ✅ Max login attempts: 5
- ✅ Lockout duration: 30 minutes
- ✅ Phone verification required

### Logging
- ✅ Log level: info
- ✅ Log rotation configured
- ✅ Max 14 files, 20MB each

---

## 🟡 NEEDS YOUR ACTUAL CREDENTIALS

Replace these placeholder values with your real credentials:

### AWS (SNS for SMS, SES for Email, S3 for Storage)
```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # ⚠️ Replace
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY  # ⚠️ Replace
```
**Get from:** https://console.aws.amazon.com/iam/

### Cloudflare R2 (Object Storage)
```env
S3_ACCESS_KEY_ID=chefpack_r2_access_key_replace_me  # ⚠️ Replace
S3_SECRET_ACCESS_KEY=chefpack_r2_secret_key_replace_me_with_actual_key  # ⚠️ Replace
```
**Get from:** https://dash.cloudflare.com/ > R2 > Manage R2 API Tokens

### Firebase FCM (Push Notifications)
```env
FCM_SERVER_KEY=AAAAxxxxxxx:APA91bHxxxxxxx...  # ⚠️ Replace
FCM_PROJECT_ID=chefpack-app-12345  # ⚠️ Replace
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."  # ⚠️ Replace
```
**Get from:** https://console.firebase.google.com/ > Project Settings > Cloud Messaging

### ShipPack (Delivery API)
```env
SHIPPACK_API_KEY=sp_live_xxxxxxxxxxxxxxxx  # ⚠️ Replace
SHIPPACK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx  # ⚠️ Replace
```
**Get from:** https://shippack.com/developers

### Stripe (Payments)
```env
STRIPE_SECRET_KEY=sk_test_51xxxxxx...  # ⚠️ Replace
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxx...  # ⚠️ Replace
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx...  # ⚠️ Replace
```
**Get from:** https://dashboard.stripe.com/apikeys

### Sentry (Error Monitoring)
```env
SENTRY_DSN=https://xxxxxxxx@o123456.ingest.sentry.io/1234567  # ⚠️ Replace
```
**Get from:** https://sentry.io/settings/projects/

### Cloudflare (CDN & WAF)
```env
CLOUDFLARE_ZONE_ID=xxxxxxxxxxxxxxxx  # ⚠️ Replace
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxx  # ⚠️ Replace
```
**Get from:** https://dash.cloudflare.com/

---

## 🔵 OPTIONAL (Can Use Defaults)

These have sensible defaults but can be customized:

### Email Settings
```env
SES_FROM_EMAIL=noreply@chefpack.com  # Change to your domain
SES_REPLY_TO_EMAIL=support@chefpack.com  # Change to your domain
```

### Nominatim (Geocoding)
```env
NOMINATIM_EMAIL=tech@chefpack.com  # Change to your email
```
**Note:** Free service, no API key needed. For production, consider Mapbox or Google Maps.

### Application URLs
```env
APP_URL=https://chefpack.com  # Change to your domain
API_URL=https://api.chefpack.com  # Change to your API domain
```

---

## 📋 Quick Start Checklist

- [x] Database passwords configured
- [x] JWT secrets generated
- [x] Service ports configured
- [x] CORS origins set
- [x] Business logic configured
- [x] Feature flags set
- [ ] AWS credentials added (if using AWS services)
- [ ] Stripe keys added (if using payments)
- [ ] Firebase credentials added (if using push notifications)
- [ ] ShipPack API key added (if using delivery)
- [ ] Sentry DSN added (if using error monitoring)

---

## 🚀 Testing Without External Services

You can start developing immediately without external API credentials:

1. **Start infrastructure:**
   ```bash
   npm run docker:up
   ```

2. **Start services:**
   ```bash
   node scripts/start-all-services.js
   ```

3. **Test authentication:**
   - OTP will be logged to console in development mode
   - No SMS will be sent (AWS SNS not required for testing)

4. **Test orders:**
   - Orders will work without ShipPack
   - Delivery tracking will be simulated

5. **Test payments:**
   - Use Stripe test mode (no real charges)
   - Or mock payments in development

---

## 🔐 Security Notes

### ✅ Already Secure
- Strong JWT secrets (64-byte hex)
- Secure database password
- Bcrypt with 12 rounds
- Rate limiting configured
- Session security enabled

### ⚠️ Before Production
1. Change database password in `.env` AND `docker-compose.yml`
2. Use environment-specific secrets (don't commit to git)
3. Enable SSL/TLS
4. Set `NODE_ENV=production`
5. Set `SESSION_COOKIE_SECURE=true`
6. Configure Cloudflare WAF
7. Enable Sentry monitoring
8. Use real API keys (not test keys)

---

## 📚 Additional Resources

- **AWS IAM:** https://console.aws.amazon.com/iam/
- **Stripe Dashboard:** https://dashboard.stripe.com/
- **Firebase Console:** https://console.firebase.google.com/
- **Cloudflare Dashboard:** https://dash.cloudflare.com/
- **Sentry:** https://sentry.io/

---

## 🎉 You're Ready!

Your `.env` file is configured for local development. You can:
1. Start coding immediately
2. Add external API credentials as needed
3. Test all services locally
4. Deploy to production when ready

**Next step:** Run `npm run docker:up` to start the infrastructure!

