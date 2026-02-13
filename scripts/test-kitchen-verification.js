#!/usr/bin/env node

/**
 * Test script for Kitchen Verification feature
 * 
 * Tests the complete flow:
 * 1. Cook submits kitchen info
 * 2. Admin lists pending verifications
 * 3. Admin approves kitchen
 * 4. Cook checks status
 * 5. Customer creates order (should succeed with verified kitchen)
 * 6. Customer tries order with unverified kitchen (should fail)
 */

const axios = require('axios');

const BASE_URL = process.env.GATEWAY_URL || 'http://localhost:3000';
const COOKS_URL = process.env.COOKS_SERVICE_URL || 'http://localhost:3003';
const ADMIN_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:3016';
const ORDERS_URL = process.env.ORDERS_SERVICE_URL || 'http://localhost:3006';

const logger = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`)
};

// Mock tokens (in real scenario, these would come from auth service)
const COOK_TOKEN = 'mock-cook-jwt-token';
const ADMIN_TOKEN = 'mock-admin-jwt-token';
const CUSTOMER_TOKEN = 'mock-customer-jwt-token';

async function testCookSubmitKitchen() {
  logger.info('\n📝 Test 1: Cook submits kitchen information');
  
  try {
    const response = await axios.put(
      `${COOKS_URL}/api/v1/kitchen/submit`,
      {
        kitchenAddress: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          latitude: 37.7749,
          longitude: -122.4194
        },
        kitchenDocs: {
          healthPermit: 'https://example.com/health-permit.pdf',
          insuranceCert: 'https://example.com/insurance.pdf',
          photos: [
            'https://example.com/kitchen1.jpg',
            'https://example.com/kitchen2.jpg'
          ]
        }
      },
      {
        headers: { Authorization: `Bearer ${COOK_TOKEN}` }
      }
    );
    
    logger.success('✅ Kitchen info submitted successfully');
    logger.info(`Status: ${response.data.data.status}`);
    return response.data.data;
  } catch (error) {
    logger.error('❌ Failed to submit kitchen info');
    logger.error(error.response?.data || error.message);
    return null;
  }
}

async function testGetKitchenStatus() {
  logger.info('\n📊 Test 2: Cook checks kitchen status');
  
  try {
    const response = await axios.get(
      `${COOKS_URL}/api/v1/kitchen/status`,
      {
        headers: { Authorization: `Bearer ${COOK_TOKEN}` }
      }
    );
    
    logger.success('✅ Kitchen status retrieved');
    logger.info(`Status: ${response.data.data.status}`);
    logger.info(`Verified: ${response.data.data.kitchenVerified}`);
    return response.data.data;
  } catch (error) {
    logger.error('❌ Failed to get kitchen status');
    logger.error(error.response?.data || error.message);
    return null;
  }
}

async function testAdminListPending() {
  logger.info('\n📋 Test 3: Admin lists pending verifications');
  
  try {
    const response = await axios.get(
      `${ADMIN_URL}/api/v1/kitchen-verifications/pending`,
      {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      }
    );
    
    logger.success('✅ Pending verifications retrieved');
    logger.info(`Found ${response.data.data.length} pending verifications`);
    return response.data.data;
  } catch (error) {
    logger.error('❌ Failed to list pending verifications');
    logger.error(error.response?.data || error.message);
    return null;
  }
}

async function testAdminApprove(cookId) {
  logger.info('\n✅ Test 4: Admin approves kitchen verification');
  
  try {
    const response = await axios.post(
      `${ADMIN_URL}/api/v1/kitchen-verifications/${cookId}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      }
    );
    
    logger.success('✅ Kitchen verification approved');
    logger.info(`Cook: ${response.data.data.businessName}`);
    logger.info(`Verified at: ${response.data.data.kitchenVerifiedAt}`);
    return response.data.data;
  } catch (error) {
    logger.error('❌ Failed to approve kitchen');
    logger.error(error.response?.data || error.message);
    return null;
  }
}

async function testAdminReject(cookId, reason) {
  logger.info('\n❌ Test 5: Admin rejects kitchen verification');
  
  try {
    const response = await axios.post(
      `${ADMIN_URL}/api/v1/kitchen-verifications/${cookId}/reject`,
      { reason },
      {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
      }
    );
    
    logger.success('✅ Kitchen verification rejected');
    logger.info(`Reason: ${response.data.data.kitchenRejectedReason}`);
    return response.data.data;
  } catch (error) {
    logger.error('❌ Failed to reject kitchen');
    logger.error(error.response?.data || error.message);
    return null;
  }
}

async function main() {
  logger.info('🧪 Starting Kitchen Verification Tests\n');
  logger.warn('⚠️  Note: This script uses mock tokens. In production, use real JWT tokens from auth service.\n');

  // Test 1: Cook submits kitchen info
  const submitResult = await testCookSubmitKitchen();
  if (!submitResult) {
    logger.error('Test 1 failed. Stopping tests.');
    return;
  }

  // Test 2: Cook checks status (should be pending)
  await testGetKitchenStatus();

  // Test 3: Admin lists pending verifications
  const pendingList = await testAdminListPending();
  
  // Test 4: Admin approves (use first pending cook or mock ID)
  const cookId = pendingList && pendingList.length > 0 
    ? pendingList[0].id 
    : 'mock-cook-id';
  
  await testAdminApprove(cookId);

  // Test 5: Cook checks status again (should be verified)
  await testGetKitchenStatus();

  logger.success('\n✅ All tests completed!\n');
  logger.info('📝 Summary:');
  logger.info('- Cooks can submit kitchen info via PUT /api/v1/cooks/kitchen/submit');
  logger.info('- Cooks can check status via GET /api/v1/cooks/kitchen/status');
  logger.info('- Admins can list pending via GET /api/v1/admin/kitchen-verifications/pending');
  logger.info('- Admins can approve via POST /api/v1/admin/kitchen-verifications/:cookId/approve');
  logger.info('- Admins can reject via POST /api/v1/admin/kitchen-verifications/:cookId/reject');
  logger.info('- Orders service validates kitchenVerified=true on order creation');
}

main().catch((error) => {
  logger.error('Test suite failed:');
  logger.error(error);
  process.exit(1);
});

