const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'API Gateway', script: 'services/api-gateway/index.js', port: 3000 },
  { name: 'Auth', script: 'services/auth/index.js', port: 3001 },
  { name: 'Users', script: 'services/users/index.js', port: 3002 },
  { name: 'Cooks', script: 'services/cooks/index.js', port: 3003 },
  { name: 'Menu', script: 'services/menu/index.js', port: 3004 },
  { name: 'Plans', script: 'services/plans/index.js', port: 3005 },
  { name: 'Orders', script: 'services/orders/index.js', port: 3006 },
  { name: 'Matching', script: 'services/matching/index.js', port: 3007 },
  { name: 'Ingredients', script: 'services/ingredients/index.js', port: 3008 },
  { name: 'Dispatch', script: 'services/dispatch/index.js', port: 3009 },
  { name: 'Payments', script: 'services/payments/index.js', port: 3010 },
  { name: 'Payouts', script: 'services/payouts/index.js', port: 3011 },
  { name: 'Notifications', script: 'services/notifications/index.js', port: 3012 },
  { name: 'Support', script: 'services/support/index.js', port: 3013 },
  { name: 'Ratings', script: 'services/ratings/index.js', port: 3014 },
  { name: 'Webhook', script: 'services/webhook/index.js', port: 3015 },
];

const processes = [];

function startService(service) {
  const proc = spawn('node', [service.script], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: service.port },
    stdio: 'inherit'
  });

  proc.on('error', (err) => {
    console.error(`❌ Failed to start ${service.name}:`, err);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️  ${service.name} exited with code ${code}`);
    }
  });

  processes.push(proc);
  console.log(`🚀 Started ${service.name} on port ${service.port}`);
}

console.log('🎬 Starting all ChefPack services...\n');

services.forEach(service => {
  setTimeout(() => startService(service), services.indexOf(service) * 500);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all services...');
  processes.forEach(proc => proc.kill());
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down all services...');
  processes.forEach(proc => proc.kill());
  process.exit(0);
});

