@echo off
REM Kitchen Verification - Complete Startup Script
REM This script starts databases, runs migrations, and starts services

echo ========================================
echo ChefPack - Kitchen Verification Setup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [1/5] Starting databases...
docker-compose up -d postgres-auth postgres-orders postgres-payments postgres-cooks redis
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start databases
    pause
    exit /b 1
)

echo [SUCCESS] Databases started
echo.

echo [2/5] Waiting for databases to initialize (15 seconds)...
timeout /t 15 /nobreak >nul
echo [SUCCESS] Databases ready
echo.

echo [3/5] Running migrations...
node scripts/migrate-kitchen-verification.js
if %errorlevel% neq 0 (
    echo [WARNING] Migrations may have failed or already applied
)
echo.

echo [4/5] Starting services...
echo.
echo Starting Admin Service (port 3016)...
start "ChefPack Admin Service" cmd /k "node services/admin/index.js"
timeout /t 2 /nobreak >nul

echo Starting Cooks Service (port 3003)...
start "ChefPack Cooks Service" cmd /k "node services/cooks/index.js"
timeout /t 2 /nobreak >nul

echo Starting Orders Service (port 3006)...
start "ChefPack Orders Service" cmd /k "node services/orders/index.js"
timeout /t 2 /nobreak >nul

echo Starting API Gateway (port 3000)...
start "ChefPack API Gateway" cmd /k "node services/api-gateway/index.js"
timeout /t 2 /nobreak >nul

echo [SUCCESS] All services started
echo.

echo [5/5] Waiting for services to be ready (10 seconds)...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo Kitchen Verification Setup Complete!
echo ========================================
echo.
echo Services running:
echo - Admin Service:    http://localhost:3016/healthz
echo - Cooks Service:    http://localhost:3003/healthz
echo - Orders Service:   http://localhost:3006/healthz
echo - API Gateway:      http://localhost:3000/healthz
echo.
echo Databases running:
echo - Auth DB:          localhost:5432
echo - Orders DB:        localhost:5433
echo - Payments DB:      localhost:5434
echo - Cooks DB:         localhost:5435
echo - Redis:            localhost:6379
echo.
echo Next steps:
echo 1. Test the implementation: node scripts/test-kitchen-verification.js
echo 2. View documentation: KITCHEN_VERIFICATION_COMPLETE.md
echo.
pause

