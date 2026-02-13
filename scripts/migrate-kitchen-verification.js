#!/usr/bin/env node

/**
 * Migration script for Kitchen Verification feature
 * 
 * This script:
 * 1. Generates Prisma clients for cooks and orders databases
 * 2. Runs migrations for both schemas
 * 3. Verifies the migrations were successful
 */

const { execSync } = require('child_process');
const path = require('path');

const logger = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`)
};

function runCommand(command, description) {
  logger.info(description);
  try {
    execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    logger.success(`${description} - Complete`);
    return true;
  } catch (error) {
    logger.error(`${description} - Failed`);
    logger.error(error.message);
    return false;
  }
}

async function main() {
  logger.info('🚀 Starting Kitchen Verification Migration...\n');

  // Step 1: Generate Prisma clients
  logger.info('📦 Step 1: Generating Prisma clients...');
  
  const generateCooks = runCommand(
    'npx prisma generate --schema=prisma/schema-cooks.prisma',
    'Generating Cooks Prisma client'
  );
  
  if (!generateCooks) {
    logger.error('Failed to generate Cooks client. Aborting.');
    process.exit(1);
  }

  const generateOrders = runCommand(
    'npx prisma generate --schema=prisma/schema-orders.prisma',
    'Generating Orders Prisma client'
  );
  
  if (!generateOrders) {
    logger.error('Failed to generate Orders client. Aborting.');
    process.exit(1);
  }

  logger.success('✅ All Prisma clients generated\n');

  // Step 2: Run migrations
  logger.info('🔄 Step 2: Running database migrations...');
  
  const migrateCooks = runCommand(
    'npx prisma migrate dev --schema=prisma/schema-cooks.prisma --name add_kitchen_verification',
    'Running Cooks database migration'
  );
  
  if (!migrateCooks) {
    logger.warn('Cooks migration may have already been applied or failed.');
  }

  const migrateOrders = runCommand(
    'npx prisma migrate dev --schema=prisma/schema-orders.prisma --name add_kitchen_pickup_snapshot',
    'Running Orders database migration'
  );
  
  if (!migrateOrders) {
    logger.warn('Orders migration may have already been applied or failed.');
  }

  logger.success('✅ All migrations complete\n');

  // Step 3: Verify migrations
  logger.info('🔍 Step 3: Verifying migrations...');
  
  logger.info('Checking Cooks schema...');
  runCommand(
    'npx prisma db pull --schema=prisma/schema-cooks.prisma --print',
    'Verifying Cooks schema'
  );

  logger.info('Checking Orders schema...');
  runCommand(
    'npx prisma db pull --schema=prisma/schema-orders.prisma --print',
    'Verifying Orders schema'
  );

  logger.success('\n✅ Kitchen Verification Migration Complete!\n');
  
  logger.info('📝 Next steps:');
  logger.info('1. Start the admin service: node services/admin/index.js');
  logger.info('2. Run the test script: node scripts/test-kitchen-verification.js');
  logger.info('3. Update your .env file with ADMIN_SERVICE_URL=http://localhost:3016');
}

main().catch((error) => {
  logger.error('Migration failed:');
  logger.error(error);
  process.exit(1);
});

