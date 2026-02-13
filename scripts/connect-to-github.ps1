# Connect ChefPack Backend to GitHub Repository
# Repository: https://github.com/Bluedion7/ChefPack.git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ChefPack Backend - Connect to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository: https://github.com/Bluedion7/ChefPack.git" -ForegroundColor White
Write-Host ""

# Check if git is available
Write-Host "[1/6] Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "[SUCCESS] $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git is not found in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please restart your terminal after installing Git, then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if GitHub CLI is available
Write-Host "[2/6] Checking GitHub CLI..." -ForegroundColor Yellow
try {
    $ghVersion = gh --version
    Write-Host "[SUCCESS] GitHub CLI is installed" -ForegroundColor Green
    $useGH = $true
} catch {
    Write-Host "[WARNING] GitHub CLI not found in PATH" -ForegroundColor Yellow
    Write-Host "We'll use manual authentication instead." -ForegroundColor Yellow
    $useGH = $false
}
Write-Host ""

# Initialize git repository
Write-Host "[3/6] Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "[INFO] Git repository already exists" -ForegroundColor Cyan
} else {
    git init
    Write-Host "[SUCCESS] Git repository initialized" -ForegroundColor Green
}
Write-Host ""

# Configure git user (if needed)
Write-Host "[4/6] Configuring Git user..." -ForegroundColor Yellow
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
Write-Host "  Name: $(git config user.name)" -ForegroundColor White
Write-Host "  Email: $(git config user.email)" -ForegroundColor White
Write-Host ""

# Add all files
Write-Host "[5/6] Adding files to Git..." -ForegroundColor Yellow
git add .
$fileCount = (git diff --cached --numstat | Measure-Object).Count
Write-Host "[SUCCESS] $fileCount files staged for commit" -ForegroundColor Green
Write-Host ""

# Create initial commit
Write-Host "[6/6] Creating initial commit..." -ForegroundColor Yellow
$commitExists = git log --oneline 2>$null
if ($commitExists) {
    Write-Host "[INFO] Commits already exist" -ForegroundColor Cyan
    Write-Host "Latest commit: $(git log -1 --oneline)" -ForegroundColor White
} else {
    git commit -m "Initial commit: ChefPack Backend with Kitchen Verification and Customer Preferences"
    Write-Host "[SUCCESS] Initial commit created" -ForegroundColor Green
}
Write-Host ""

# Connect to GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Connecting to GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($useGH) {
    # Use GitHub CLI
    Write-Host "Authenticating with GitHub CLI..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow the prompts to authenticate:" -ForegroundColor Cyan
    Write-Host "1. Choose: GitHub.com" -ForegroundColor White
    Write-Host "2. Choose: HTTPS" -ForegroundColor White
    Write-Host "3. Choose: Login with a web browser (recommended)" -ForegroundColor White
    Write-Host "4. Copy the one-time code and press Enter" -ForegroundColor White
    Write-Host "5. Paste the code in your browser" -ForegroundColor White
    Write-Host ""
    
    gh auth login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[SUCCESS] GitHub authentication complete!" -ForegroundColor Green
        Write-Host ""
        
        # Add remote
        Write-Host "Adding remote repository..." -ForegroundColor Yellow
        $remoteExists = git remote get-url origin 2>$null
        if ($remoteExists) {
            Write-Host "[INFO] Remote 'origin' already exists: $remoteExists" -ForegroundColor Cyan
            $response = Read-Host "Update remote URL? (y/n)"
            if ($response -eq "y") {
                git remote set-url origin https://github.com/Bluedion7/ChefPack.git
                Write-Host "[SUCCESS] Remote URL updated" -ForegroundColor Green
            }
        } else {
            git remote add origin https://github.com/Bluedion7/ChefPack.git
            Write-Host "[SUCCESS] Remote 'origin' added" -ForegroundColor Green
        }
        
        # Push to GitHub
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "[ERROR] Failed to push to GitHub" -ForegroundColor Red
            Write-Host "The repository might already have content." -ForegroundColor Yellow
            Write-Host "Try: git pull origin main --rebase" -ForegroundColor Yellow
            Write-Host "Then: git push origin main" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "[ERROR] GitHub authentication failed" -ForegroundColor Red
    }
} else {
    # Manual setup
    Write-Host "Manual GitHub setup:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Step 1: Add remote repository" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/Bluedion7/ChefPack.git" -ForegroundColor White
    Write-Host ""
    Write-Host "Step 2: Rename branch to main" -ForegroundColor Cyan
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host ""
    Write-Host "Step 3: Push to GitHub" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "When prompted for credentials:" -ForegroundColor Yellow
    Write-Host "  Username: Bluedion7" -ForegroundColor White
    Write-Host "  Password: Use a Personal Access Token (not your GitHub password)" -ForegroundColor White
    Write-Host ""
    Write-Host "To create a Personal Access Token:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "  2. Click 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "  3. Select scope: 'repo'" -ForegroundColor White
    Write-Host "  4. Copy the token and use it as your password" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Repository URL: https://github.com/Bluedion7/ChefPack" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

