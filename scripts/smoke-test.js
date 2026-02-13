const axios = require('axios');

const services = [
  { name: 'API Gateway', url: 'http://localhost:3000/healthz' },
  { name: 'Auth Service', url: 'http://localhost:3001/healthz' },
  { name: 'Users Service', url: 'http://localhost:3002/healthz' },
  { name: 'Cooks Service', url: 'http://localhost:3003/healthz' },
  { name: 'Menu Service', url: 'http://localhost:3004/healthz' },
  { name: 'Plans Service', url: 'http://localhost:3005/healthz' },
  { name: 'Orders Service', url: 'http://localhost:3006/healthz' },
  { name: 'Matching Service', url: 'http://localhost:3007/healthz' },
  { name: 'Ingredients Service', url: 'http://localhost:3008/healthz' },
  { name: 'Dispatch Service', url: 'http://localhost:3009/healthz' },
  { name: 'Payments Service', url: 'http://localhost:3010/healthz' },
  { name: 'Payouts Service', url: 'http://localhost:3011/healthz' },
  { name: 'Notifications Service', url: 'http://localhost:3012/healthz' },
  { name: 'Support Service', url: 'http://localhost:3013/healthz' },
  { name: 'Ratings Service', url: 'http://localhost:3014/healthz' },
  { name: 'Webhook Service', url: 'http://localhost:3015/healthz' },
];

async function testService(service) {
  try {
    const response = await axios.get(service.url, { timeout: 5000 });
    if (response.status === 200 && response.data.status === 'ok') {
      console.log(`✅ ${service.name} - OK`);
      return true;
    } else {
      console.log(`❌ ${service.name} - Unexpected response`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${service.name} - ${error.message}`);
    return false;
  }
}

async function runSmokeTests() {
  console.log('🧪 Running smoke tests...\n');
  
  const results = await Promise.all(services.map(testService));
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${passed}/${total} services healthy`);
  
  if (passed === total) {
    console.log('✅ All services are healthy!');
    process.exit(0);
  } else {
    console.log('❌ Some services are down');
    process.exit(1);
  }
}

runSmokeTests();

