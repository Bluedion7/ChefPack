#!/usr/bin/env node

/**
 * Migration script for user preferences feature
 * Generates Prisma clients and runs migrations for auth and orders schemas
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Starting preference migration...\n');

// Step 1: Generate Prisma clients
console.log('📦 Step 1: Generating Prisma clients...');
try {
  execSync('npx prisma generate --schema=prisma/schema-auth.prisma', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Auth client generated\n');
} catch (error) {
  console.error('❌ Failed to generate auth client:', error.message);
  process.exit(1);
}

try {
  execSync('npx prisma generate --schema=prisma/schema-orders.prisma', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Orders client generated\n');
} catch (error) {
  console.error('❌ Failed to generate orders client:', error.message);
  process.exit(1);
}

// Step 2: Run migrations
console.log('🗄️  Step 2: Running database migrations...');
try {
  execSync('npx prisma migrate dev --schema=prisma/schema-auth.prisma --name add_user_preferences', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Auth migration completed\n');
} catch (error) {
  console.error('❌ Failed to run auth migration:', error.message);
  process.exit(1);
}

try {
  execSync('npx prisma migrate dev --schema=prisma/schema-orders.prisma --name add_preference_tracking', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Orders migration completed\n');
} catch (error) {
  console.error('❌ Failed to run orders migration:', error.message);
  process.exit(1);
}

console.log('✨ Migration completed successfully!\n');
console.log('Next steps:');
console.log('1. Restart services: node scripts/start-all-services.js');
console.log('2. Test preferences API: curl -X GET http://localhost:3000/api/v1/users/preferences/me');

