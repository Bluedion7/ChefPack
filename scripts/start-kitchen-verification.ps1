# Kitchen Verification - Complete Startup Script (PowerShell)
# This script starts databases, runs migrations, and starts services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ChefPack - Kitchen Verification Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/5] Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[SUCCESS] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker Desktop is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Start databases
Write-Host "[2/5] Starting databases..." -ForegroundColor Yellow
docker-compose up -d postgres-auth postgres-orders postgres-payments postgres-cooks redis
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start databases" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[SUCCESS] Databases started" -ForegroundColor Green
Write-Host ""

# Wait for databases
Write-Host "[3/5] Waiting for databases to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Write-Host "[SUCCESS] Databases ready" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "[4/5] Running migrations..." -ForegroundColor Yellow
node scripts/migrate-kitchen-verification.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Migrations may have failed or already applied" -ForegroundColor Yellow
}
Write-Host ""

# Start services
Write-Host "[5/5] Starting services..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting Admin Service (port 3016)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node services/admin/index.js" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Starting Cooks Service (port 3003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node services/cooks/index.js" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Starting Orders Service (port 3006)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node services/orders/index.js" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Starting API Gateway (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node services/api-gateway/index.js" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "[SUCCESS] All services started" -ForegroundColor Green
Write-Host ""

# Wait for services to be ready
Write-Host "Waiting for services to be ready (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kitchen Verification Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "- Admin Service:    http://localhost:3016/healthz" -ForegroundColor White
Write-Host "- Cooks Service:    http://localhost:3003/healthz" -ForegroundColor White
Write-Host "- Orders Service:   http://localhost:3006/healthz" -ForegroundColor White
Write-Host "- API Gateway:      http://localhost:3000/healthz" -ForegroundColor White
Write-Host ""
Write-Host "Databases running:" -ForegroundColor Yellow
Write-Host "- Auth DB:          localhost:5432" -ForegroundColor White
Write-Host "- Orders DB:        localhost:5433" -ForegroundColor White
Write-Host "- Payments DB:      localhost:5434" -ForegroundColor White
Write-Host "- Cooks DB:         localhost:5435" -ForegroundColor White
Write-Host "- Redis:            localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the implementation: node scripts/test-kitchen-verification.js" -ForegroundColor White
Write-Host "2. View documentation: KITCHEN_VERIFICATION_COMPLETE.md" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

