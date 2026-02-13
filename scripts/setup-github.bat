@echo off
REM GitHub Repository Setup Script (Batch)
REM This script initializes git and provides instructions for GitHub setup

echo ========================================
echo ChefPack Backend - GitHub Setup
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Git is installed
echo.

REM Initialize git repository
echo [1/4] Initializing Git repository...
if exist .git (
    echo [WARNING] Git repository already exists
) else (
    git init
    echo [SUCCESS] Git repository initialized
)
echo.

REM Configure git user (if needed)
echo [2/4] Checking Git configuration...
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo Please enter your name for Git commits:
    set /p GIT_NAME="Name: "
    git config user.name "%GIT_NAME%"
    
    echo Please enter your email for Git commits:
    set /p GIT_EMAIL="Email: "
    git config user.email "%GIT_EMAIL%"
)
echo [SUCCESS] Git user configured
echo.

REM Add all files
echo [3/4] Adding files to Git...
git add .
echo [SUCCESS] Files added
echo.

REM Create initial commit
echo [4/4] Creating initial commit...
git commit -m "Initial commit: ChefPack Backend with Kitchen Verification feature"
echo [SUCCESS] Initial commit created
echo.

REM Provide GitHub instructions
echo ========================================
echo Manual GitHub Setup Required
echo ========================================
echo.
echo Please follow these steps:
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: chefpack-backend (or your preferred name)
echo 3. Choose: Public or Private
echo 4. Do NOT initialize with README, .gitignore, or license
echo 5. Click "Create repository"
echo.
echo Then run these commands (replace YOUR_USERNAME and REPO_NAME):
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo ========================================
echo.
pause

