# GitHub Repository Setup Script
# This script initializes git and connects to a new GitHub repository

param(
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "chefpack-backend",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Private = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ChefPack Backend - GitHub Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "[1/7] Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "[SUCCESS] Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if GitHub CLI is installed
Write-Host "[2/7] Checking GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version
    Write-Host "[SUCCESS] GitHub CLI is installed" -ForegroundColor Green
    $useGH = $true
} catch {
    Write-Host "[WARNING] GitHub CLI not installed" -ForegroundColor Yellow
    Write-Host "You can install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "We'll use manual setup instead." -ForegroundColor Yellow
    $useGH = $false
}
Write-Host ""

# Get GitHub username if not provided
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "Enter your GitHub username:" -ForegroundColor Cyan
    $GitHubUsername = Read-Host
}

# Initialize git repository
Write-Host "[3/7] Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "[WARNING] Git repository already exists" -ForegroundColor Yellow
} else {
    git init
    Write-Host "[SUCCESS] Git repository initialized" -ForegroundColor Green
}
Write-Host ""

# Configure git user (if not already configured)
Write-Host "[4/7] Configuring Git user..." -ForegroundColor Yellow
$gitUserName = git config user.name
$gitUserEmail = git config user.email

if ([string]::IsNullOrEmpty($gitUserName)) {
    Write-Host "Enter your name for Git commits:" -ForegroundColor Cyan
    $name = Read-Host
    git config user.name "$name"
}

if ([string]::IsNullOrEmpty($gitUserEmail)) {
    Write-Host "Enter your email for Git commits:" -ForegroundColor Cyan
    $email = Read-Host
    git config user.email "$email"
}
Write-Host "[SUCCESS] Git user configured" -ForegroundColor Green
Write-Host ""

# Add all files
Write-Host "[5/7] Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "[SUCCESS] Files added" -ForegroundColor Green
Write-Host ""

# Create initial commit
Write-Host "[6/7] Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: ChefPack Backend with Kitchen Verification feature"
Write-Host "[SUCCESS] Initial commit created" -ForegroundColor Green
Write-Host ""

# Create GitHub repository and push
Write-Host "[7/7] Setting up GitHub repository..." -ForegroundColor Yellow

if ($useGH) {
    # Use GitHub CLI
    Write-Host "Creating GitHub repository using GitHub CLI..." -ForegroundColor Cyan
    
    $visibility = if ($Private) { "--private" } else { "--public" }
    
    gh repo create $RepoName $visibility --source=. --remote=origin --push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Repository created and pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to create repository" -ForegroundColor Red
    }
} else {
    # Manual setup
    Write-Host "Manual GitHub setup required:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: $RepoName" -ForegroundColor White
    Write-Host "3. Choose: $( if ($Private) { 'Private' } else { 'Public' } )" -ForegroundColor White
    Write-Host "4. Do NOT initialize with README, .gitignore, or license" -ForegroundColor White
    Write-Host "5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run these commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "git remote add origin https://github.com/$GitHubUsername/$RepoName.git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Have you created the repository? (y/n)"
    if ($response -eq "y") {
        Write-Host ""
        Write-Host "Adding remote and pushing..." -ForegroundColor Yellow
        git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Code pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to push to GitHub" -ForegroundColor Red
            Write-Host "You may need to authenticate with GitHub" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. View your repository: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor White
Write-Host "2. Add collaborators (Settings > Collaborators)" -ForegroundColor White
Write-Host "3. Set up branch protection rules (Settings > Branches)" -ForegroundColor White
Write-Host "4. Configure GitHub Actions for CI/CD" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

