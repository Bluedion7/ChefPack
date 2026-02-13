#!/bin/bash
# Connect ChefPack Backend to GitHub Repository
# Repository: https://github.com/Bluedion7/ChefPack.git

echo "========================================"
echo "ChefPack Backend - Connect to GitHub"
echo "========================================"
echo ""
echo "Repository: https://github.com/Bluedion7/ChefPack.git"
echo ""

# Check if git is available
echo "[1/7] Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed or not in PATH!"
    exit 1
fi
echo "[SUCCESS] Git is installed: $(git --version)"
echo ""

# Check if GitHub CLI is available
echo "[2/7] Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "[SUCCESS] GitHub CLI is installed: $(gh --version | head -n 1)"
    USE_GH=true
else
    echo "[WARNING] GitHub CLI not found"
    echo "We'll use manual authentication instead."
    USE_GH=false
fi
echo ""

# Initialize git repository
echo "[3/7] Initializing Git repository..."
if [ -d ".git" ]; then
    echo "[INFO] Git repository already exists"
else
    git init
    echo "[SUCCESS] Git repository initialized"
fi
echo ""

# Configure git user
echo "[4/7] Configuring Git user..."
GIT_USER_NAME=$(git config user.name)
GIT_USER_EMAIL=$(git config user.email)

if [ -z "$GIT_USER_NAME" ]; then
    git config user.name "Bluedion7"
    echo "[SUCCESS] Git user.name set to: Bluedion7"
else
    echo "[INFO] Git user.name already set to: $GIT_USER_NAME"
fi

if [ -z "$GIT_USER_EMAIL" ]; then
    echo "Enter your email for Git commits:"
    read -r email
    git config user.email "$email"
    echo "[SUCCESS] Git user.email set"
else
    echo "[INFO] Git user.email already set to: $GIT_USER_EMAIL"
fi
echo ""

# Add all files
echo "[5/7] Adding files to Git..."
git add .
FILE_COUNT=$(git diff --cached --numstat | wc -l)
echo "[SUCCESS] $FILE_COUNT files staged for commit"
echo ""

# Create initial commit
echo "[6/7] Creating initial commit..."
if git log --oneline &> /dev/null; then
    echo "[INFO] Commits already exist"
    echo "Latest commit: $(git log -1 --oneline)"
else
    git commit -m "Initial commit: ChefPack Backend with Kitchen Verification and Customer Preferences"
    echo "[SUCCESS] Initial commit created"
fi
echo ""

# Connect to GitHub
echo "[7/7] Connecting to GitHub..."
echo ""

if [ "$USE_GH" = true ]; then
    # Check if already authenticated
    echo "Checking GitHub authentication..."
    if gh auth status &> /dev/null; then
        echo "[SUCCESS] Already authenticated with GitHub"
    else
        echo "Authenticating with GitHub CLI..."
        echo ""
        echo "Please follow the prompts:"
        echo "1. Choose: GitHub.com"
        echo "2. Choose: HTTPS"
        echo "3. Choose: Login with a web browser"
        echo "4. Copy the one-time code and press Enter"
        echo "5. Paste the code in your browser"
        echo ""
        gh auth login
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "[SUCCESS] GitHub authentication complete!"
        else
            echo ""
            echo "[ERROR] GitHub authentication failed"
            exit 1
        fi
    fi
    echo ""
    
    # Add remote
    echo "Adding remote repository..."
    if git remote get-url origin &> /dev/null; then
        CURRENT_REMOTE=$(git remote get-url origin)
        echo "[INFO] Remote 'origin' already exists: $CURRENT_REMOTE"
        echo "Updating remote URL..."
        git remote set-url origin https://github.com/Bluedion7/ChefPack.git
        echo "[SUCCESS] Remote URL updated"
    else
        git remote add origin https://github.com/Bluedion7/ChefPack.git
        echo "[SUCCESS] Remote 'origin' added"
    fi
    echo ""
    
    # Push to GitHub
    echo "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================"
        echo "SUCCESS! Code pushed to GitHub!"
        echo "========================================"
        echo ""
        echo "Repository URL: https://github.com/Bluedion7/ChefPack"
        echo ""
    else
        echo ""
        echo "[ERROR] Failed to push to GitHub"
        echo "The repository might already have content."
        echo ""
        echo "Try these commands:"
        echo "  git pull origin main --rebase"
        echo "  git push origin main"
        echo ""
    fi
else
    # Manual setup
    echo "Manual GitHub setup required:"
    echo ""
    echo "Step 1: Add remote repository"
    echo "  git remote add origin https://github.com/Bluedion7/ChefPack.git"
    echo ""
    echo "Step 2: Rename branch to main"
    echo "  git branch -M main"
    echo ""
    echo "Step 3: Push to GitHub"
    echo "  git push -u origin main"
    echo ""
    echo "When prompted for credentials:"
    echo "  Username: Bluedion7"
    echo "  Password: Use a Personal Access Token"
    echo ""
    echo "To create a Personal Access Token:"
    echo "  1. Go to: https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token (classic)'"
    echo "  3. Select scope: 'repo'"
    echo "  4. Copy the token and use it as your password"
    echo ""
fi

echo ""
echo "Done!"

