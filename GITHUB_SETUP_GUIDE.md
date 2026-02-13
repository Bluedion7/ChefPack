# 🚀 GitHub Setup Guide - ChefPack Backend

## 📋 Quick Setup (Automated)

### **Option 1: Using PowerShell Script (Recommended)**

```powershell
# Run the automated setup script
.\scripts\setup-github.ps1

# With custom repository name
.\scripts\setup-github.ps1 -RepoName "my-chefpack-backend"

# Create private repository
.\scripts\setup-github.ps1 -Private

# Specify GitHub username
.\scripts\setup-github.ps1 -GitHubUsername "yourusername" -RepoName "chefpack-backend"
```

### **Option 2: Using Batch Script**

```cmd
scripts\setup-github.bat
```

---

## 📝 Manual Setup (Step-by-Step)

### **Step 1: Initialize Git Repository**

```bash
# Initialize git
git init

# Configure git user (if not already configured)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChefPack Backend with Kitchen Verification feature"
```

### **Step 2: Create GitHub Repository**

1. Go to **https://github.com/new**
2. **Repository name**: `chefpack-backend` (or your preferred name)
3. **Description**: "ChefPack microservices backend with kitchen verification"
4. Choose **Public** or **Private**
5. **Do NOT** check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
6. Click **"Create repository"**

### **Step 3: Connect Local Repository to GitHub**

```bash
# Add remote origin (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 🔐 Authentication Options

### **Option 1: Personal Access Token (Recommended)**

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: "ChefPack Backend"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. When pushing, use the token as your password:
   ```
   Username: your-github-username
   Password: ghp_xxxxxxxxxxxxxxxxxxxx (your token)
   ```

### **Option 2: GitHub CLI (Easiest)**

```bash
# Install GitHub CLI
# Download from: https://cli.github.com/

# Authenticate
gh auth login

# Create and push repository
gh repo create chefpack-backend --public --source=. --remote=origin --push
```

### **Option 3: SSH Key**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Use SSH remote URL
git remote set-url origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

---

## 📂 What Gets Pushed to GitHub

### **Included:**
- ✅ All source code (`services/`, `shared/`, `scripts/`)
- ✅ Configuration files (`package.json`, `docker-compose.yml`)
- ✅ Prisma schemas (`prisma/schema-*.prisma`)
- ✅ Documentation (`.md` files)
- ✅ `.gitignore` file

### **Excluded (via .gitignore):**
- ❌ `node_modules/` (dependencies)
- ❌ `.env` (environment variables - **NEVER commit this!**)
- ❌ `logs/` (log files)
- ❌ `coverage/` (test coverage)
- ❌ `prisma/migrations/` (database migrations)
- ❌ IDE files (`.vscode/`, `.idea/`)

---

## 🔒 Important Security Notes

### **⚠️ NEVER Commit These Files:**
- `.env` - Contains sensitive credentials
- `node_modules/` - Too large, can be reinstalled
- Database files
- API keys or secrets
- Private keys

### **✅ Create `.env.example` Instead:**

```bash
# Copy .env to .env.example and remove sensitive values
cp .env .env.example
```

Then edit `.env.example` to show structure without real values:

```env
# Database URLs
DATABASE_AUTH_URL=postgresql://user:password@localhost:5432/chefpack_auth
DATABASE_ORDERS_URL=postgresql://user:password@localhost:5433/chefpack_orders
DATABASE_PAYMENTS_URL=postgresql://user:password@localhost:5434/chefpack_payments
DATABASE_COOKS_URL=postgresql://user:password@localhost:5435/chefpack_cooks

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
USERS_SERVICE_URL=http://localhost:3002
COOKS_SERVICE_URL=http://localhost:3003
# ... etc
```

---

## 📊 Repository Structure

```
chefpack-backend/
├── services/           # Microservices
│   ├── admin/         # NEW: Kitchen verification admin
│   ├── api-gateway/
│   ├── auth/
│   ├── cooks/
│   ├── orders/
│   └── ...
├── shared/            # Shared utilities
│   ├── middleware/
│   └── logger.js
├── prisma/            # Database schemas
│   ├── schema-auth.prisma
│   ├── schema-cooks.prisma
│   ├── schema-orders.prisma
│   └── schema-payments.prisma
├── scripts/           # Utility scripts
│   ├── setup-github.ps1
│   ├── migrate-kitchen-verification.js
│   └── test-kitchen-verification.js
├── docker-compose.yml
├── package.json
├── .gitignore
└── README.md
```

---

## 🌿 Recommended Branch Strategy

### **Main Branches:**
- `main` - Production-ready code
- `dev` - Development branch
- `staging` - Staging/QA branch

### **Feature Branches:**
```bash
# Create feature branch
git checkout -b feature/user-authentication

# Work on feature...
git add .
git commit -m "Add user authentication"

# Push feature branch
git push origin feature/user-authentication

# Create Pull Request on GitHub
```

---

## 🔄 Common Git Commands

```bash
# Check status
git status

# Add files
git add .
git add specific-file.js

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
```

---

## 📝 Commit Message Best Practices

```bash
# Good commit messages
git commit -m "Add kitchen verification endpoints"
git commit -m "Fix order validation bug"
git commit -m "Update README with setup instructions"

# Bad commit messages
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### **Conventional Commits Format:**
```
feat: Add kitchen verification feature
fix: Resolve order creation bug
docs: Update API documentation
refactor: Simplify authentication logic
test: Add unit tests for orders service
chore: Update dependencies
```

---

## 🎯 Next Steps After GitHub Setup

1. **Add README badges**:
   ```markdown
   ![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
   ![License](https://img.shields.io/badge/license-MIT-blue)
   ```

2. **Set up GitHub Actions** for CI/CD
3. **Add branch protection rules** (Settings → Branches)
4. **Invite collaborators** (Settings → Collaborators)
5. **Create issues** for feature tracking
6. **Set up project board** for task management

---

## ❓ Troubleshooting

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### **Error: "failed to push some refs"**
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### **Error: "Authentication failed"**
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

---

## ✅ Verification

After setup, verify everything is working:

```bash
# Check remote
git remote -v

# Check branch
git branch

# View last commit
git log -1

# Visit your repository
# https://github.com/YOUR_USERNAME/REPO_NAME
```

---

**🎉 Your ChefPack Backend is now on GitHub!**

