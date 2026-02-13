# 🚀 Connect ChefPack Backend to GitHub

## Repository Information
- **Repository URL:** https://github.com/Bluedion7/ChefPack.git
- **Owner:** Bluedion7
- **Repository Name:** ChefPack

---

## ⚡ Quick Setup (After Restarting Terminal)

### **Step 1: Restart Your Terminal**

After installing Git and GitHub CLI, you need to **restart your PowerShell terminal** so they are recognized in PATH.

1. Close this terminal window
2. Open a new PowerShell window
3. Navigate back to the project:
   ```powershell
   cd C:\Users\Laptop\Downloads\ChefPack\Backend
   ```

---

### **Step 2: Run the Automated Script**

```powershell
.\scripts\connect-to-github.ps1
```

This script will:
- ✅ Initialize git repository
- ✅ Configure git user
- ✅ Add all files
- ✅ Create initial commit
- ✅ Authenticate with GitHub CLI
- ✅ Connect to your repository
- ✅ Push code to GitHub

---

## 🔐 GitHub CLI Authentication

When the script runs `gh auth login`, follow these prompts:

```
? What account do you want to log into?
> GitHub.com

? What is your preferred protocol for Git operations?
> HTTPS

? Authenticate Git with your GitHub credentials?
> Yes

? How would you like to authenticate GitHub CLI?
> Login with a web browser

! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
```

**Steps:**
1. Copy the one-time code shown
2. Press Enter (browser will open)
3. Paste the code in the browser
4. Click "Authorize GitHub CLI"
5. Return to terminal - authentication complete!

---

## 📝 Manual Setup (If Automated Script Fails)

### **1. Initialize Git**

```powershell
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### **2. Add Files and Commit**

```powershell
git add .
git commit -m "Initial commit: ChefPack Backend with Kitchen Verification and Customer Preferences"
```

### **3. Connect to GitHub**

```powershell
git remote add origin https://github.com/Bluedion7/ChefPack.git
git branch -M main
```

### **4. Authenticate with GitHub CLI**

```powershell
gh auth login
```

Follow the prompts as described above.

### **5. Push to GitHub**

```powershell
git push -u origin main
```

---

## 🔑 Alternative: Personal Access Token

If GitHub CLI doesn't work, use a Personal Access Token:

### **Create Token:**
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: "ChefPack Backend"
4. Select scope: ✅ **repo** (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_`)

### **Push with Token:**

```powershell
git remote add origin https://github.com/Bluedion7/ChefPack.git
git branch -M main
git push -u origin main
```

When prompted:
- **Username:** `Bluedion7`
- **Password:** `ghp_xxxxxxxxxxxxxxxxxxxx` (paste your token)

---

## ✅ Verification

After successful push, verify:

1. **Visit your repository:**
   ```
   https://github.com/Bluedion7/ChefPack
   ```

2. **Check files are there:**
   - services/
   - prisma/
   - scripts/
   - All .md documentation files

3. **Verify .env is NOT there:**
   - ✅ `.env.example` should be visible
   - ❌ `.env` should NOT be visible (contains secrets)

---

## 🆘 Troubleshooting

### **Error: "git is not recognized"**
- Restart your terminal after installing Git
- Or add Git to PATH manually

### **Error: "gh is not recognized"**
- Restart your terminal after installing GitHub CLI
- Or use Personal Access Token method instead

### **Error: "remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/Bluedion7/ChefPack.git
```

### **Error: "failed to push some refs"**

The repository might have existing content. Try:

```powershell
# Pull first (if repository has content)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

Or force push (⚠️ **WARNING: This will overwrite remote content**):
```powershell
git push -u origin main --force
```

### **Error: "Authentication failed"**
- Make sure you're using a Personal Access Token, not your GitHub password
- Or authenticate with GitHub CLI: `gh auth login`

---

## 📊 What Gets Pushed

### **✅ Included:**
- All source code (services/, shared/, scripts/)
- Configuration files (package.json, docker-compose.yml)
- Prisma schemas (prisma/schema-*.prisma)
- Documentation (all .md files)
- .gitignore and .env.example

### **❌ Excluded:**
- node_modules/ (too large)
- .env (contains secrets - **NEVER commit this!**)
- logs/ (log files)
- coverage/ (test coverage)
- prisma/migrations/ (database migrations)

---

## 🎯 Next Steps After Push

1. **View your repository:**
   - https://github.com/Bluedion7/ChefPack

2. **Add a README.md** to the repository root (if not exists)

3. **Set up branch protection:**
   - Settings → Branches → Add rule for `main`

4. **Invite collaborators:**
   - Settings → Collaborators → Add people

5. **Set up GitHub Actions** for CI/CD

---

## 📞 Need Help?

If you encounter issues:

1. **Check Git installation:**
   ```powershell
   git --version
   ```

2. **Check GitHub CLI installation:**
   ```powershell
   gh --version
   ```

3. **Check git status:**
   ```powershell
   git status
   ```

4. **Check remote:**
   ```powershell
   git remote -v
   ```

---

## 🎉 Ready!

**After restarting your terminal, run:**

```powershell
cd C:\Users\Laptop\Downloads\ChefPack\Backend
.\scripts\connect-to-github.ps1
```

The script will guide you through the entire process!

