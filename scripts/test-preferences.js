#!/usr/bin/env node

/**
 * Test script for user preferences feature
 * Tests the complete flow: auth -> set preferences -> check meal compatibility -> create order
 */

const axios = require('axios');

const API_BASE = process.env.API_GATEWAY_URL || 'http://localhost:3000/api/v1';
const TEST_PHONE = '+15555551234';

let accessToken = '';
let userId = '';
let mealId = '';

console.log('🧪 Testing User Preferences Feature\n');

async function test() {
  try {
    // Step 1: Send OTP
    console.log('📱 Step 1: Sending OTP...');
    const otpResponse = await axios.post(`${API_BASE}/auth/send-otp`, {
      phone: TEST_PHONE
    });
    console.log('✅ OTP sent:', otpResponse.data.otp || 'Check logs');

    // Step 2: Verify OTP (use the OTP from dev mode)
    console.log('\n🔐 Step 2: Verifying OTP...');
    const verifyResponse = await axios.post(`${API_BASE}/auth/verify-otp`, {
      phone: TEST_PHONE,
      otp: otpResponse.data.otp || '123456' // Use actual OTP in production
    });
    accessToken = verifyResponse.data.data.accessToken;
    userId = verifyResponse.data.data.userId;
    console.log('✅ Authenticated. User ID:', userId);

    // Step 3: Set user preferences
    console.log('\n🍽️  Step 3: Setting user preferences...');
    const prefsResponse = await axios.put(
      `${API_BASE}/users/preferences/me`,
      {
        dietTags: ['vegan', 'gluten_free_pref'],
        allergens: ['peanuts', 'dairy'],
        allergenSeverity: 'severe',
        avoidCrossContact: true,
        spiceLevel: 2,
        tasteLikes: ['spicy', 'savory'],
        tasteDislikes: ['sweet']
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    console.log('✅ Preferences set:', JSON.stringify(prefsResponse.data.data, null, 2));

    // Step 4: Get preferences
    console.log('\n📋 Step 4: Getting user preferences...');
    const getPrefsResponse = await axios.get(
      `${API_BASE}/users/preferences/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    console.log('✅ Current preferences:', JSON.stringify(getPrefsResponse.data.data, null, 2));

    // Step 5: Check meal compatibility (if meal exists)
    console.log('\n🔍 Step 5: Checking meal compatibility...');
    try {
      const mealsResponse = await axios.get(`${API_BASE}/menu`);
      if (mealsResponse.data.data && mealsResponse.data.data.length > 0) {
        mealId = mealsResponse.data.data[0].id;
        const mealResponse = await axios.get(
          `${API_BASE}/menu/${mealId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        console.log('✅ Meal compatibility:', JSON.stringify(mealResponse.data.data.compatibility, null, 2));
      } else {
        console.log('⚠️  No meals available to test compatibility');
      }
    } catch (error) {
      console.log('⚠️  Meal compatibility check skipped (no meals available)');
    }

    // Step 6: Try to create order with conflicting meal (should fail without override)
    console.log('\n🛒 Step 6: Creating order with potential conflicts...');
    try {
      const orderResponse = await axios.post(
        `${API_BASE}/orders`,
        {
          items: [
            {
              mealId: mealId || 'test-meal-id',
              quantity: 2
            }
          ],
          deliveryAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94102'
          },
          deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          deliveryTime: '18:00',
          override: false
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log('✅ Order created:', orderResponse.data.data.orderNumber);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('✅ Order blocked due to conflicts (as expected)');
        console.log('   Conflicts:', JSON.stringify(error.response.data.conflicts, null, 2));
        
        // Step 7: Create order with override
        console.log('\n✅ Step 7: Creating order with override...');
        const overrideResponse = await axios.post(
          `${API_BASE}/orders`,
          {
            items: [
              {
                mealId: mealId || 'test-meal-id',
                quantity: 2
              }
            ],
            deliveryAddress: {
              street: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94102'
            },
            deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            deliveryTime: '18:00',
            override: true
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        console.log('✅ Order created with override:', overrideResponse.data.data.orderNumber);
      } else {
        throw error;
      }
    }

    console.log('\n✨ All tests passed!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

test();

