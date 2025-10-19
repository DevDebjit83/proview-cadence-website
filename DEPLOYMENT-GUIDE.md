# 🚀 Deploy ProView Cadence to GitHub & Vercel

## Complete Step-by-Step CLI Guide

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Git installed (`git --version`)
- ✅ GitHub account created
- ✅ Vercel account created (sign up at https://vercel.com)
- ✅ Vercel CLI installed globally

---

## 🔧 STEP 1: Install Required Tools

### Install Vercel CLI
```bash
npm install -g vercel
```

### Verify installations
```bash
git --version
vercel --version
```

---

## 📦 STEP 2: Initialize Git Repository

### Navigate to your project
```bash
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
```

### Initialize Git (if not already done)
```bash
git init
```

### Add all files to staging
```bash
git add .
```

### Create first commit
```bash
git commit -m "Initial commit: ProView Cadence dynamic website with AI chatbot"
```

---

## 🌐 STEP 3: Create GitHub Repository

### Option A: Using GitHub CLI (if installed)
```bash
# Install GitHub CLI (if not installed)
sudo apt install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create proview-cadence-website --public --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### Option B: Manual Method (Recommended)

1. **Go to GitHub.com** and login
2. **Click "+" icon** → "New repository"
3. **Repository details:**
   - Name: `proview-cadence-website`
   - Description: `Dynamic ProView Cadence website with AI chatbot`
   - Visibility: Public
   - **DO NOT** initialize with README (you already have files)
4. **Click "Create repository"**

5. **Connect your local repo to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/proview-cadence-website.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## 🚀 STEP 4: Deploy to Vercel

### Login to Vercel
```bash
vercel login
```
- This will open a browser for authentication
- Confirm the login

### Deploy to Vercel
```bash
vercel
```

**Follow the prompts:**
1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → Select your account
3. **Link to existing project?** → `N` (No)
4. **What's your project's name?** → `proview-cadence` (or press Enter for auto-name)
5. **In which directory is your code located?** → `./` (press Enter)
6. **Want to override the settings?** → `N` (No)

Vercel will:
- ✅ Build your project
- ✅ Deploy to a preview URL
- ✅ Give you a temporary URL like: `https://proview-cadence-xyz123.vercel.app`

### Deploy to Production
```bash
vercel --prod
```

This creates your production deployment at:
`https://proview-cadence.vercel.app`

---

## ⚙️ STEP 5: Configure Vercel Project

### Add Environment Variables (if needed)
```bash
vercel env add ADMIN_PASSWORD
```

### View your deployments
```bash
vercel ls
```

### Open your live website
```bash
vercel open
```

---

## 🔄 STEP 6: Future Updates (Continuous Deployment)

After initial setup, to update your website:

### 1. Make changes to your code
### 2. Commit to Git
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### 3. Vercel auto-deploys OR manual deploy
```bash
vercel --prod
```

**✨ Vercel automatically deploys when you push to GitHub!**

---

## 📱 STEP 7: Connect Custom Domain (Optional)

### Add your custom domain
```bash
vercel domains add yourdomain.com
```

### Follow DNS instructions provided by Vercel

---

## 🛠️ Useful Vercel Commands

```bash
# View logs
vercel logs

# List all projects
vercel ls

# Remove a deployment
vercel rm deployment-url

# View project info
vercel inspect

# Alias deployment to custom domain
vercel alias deployment-url yourdomain.com
```

---

## 📊 Your Deployment URLs

After deployment, you'll have:

**🌍 Production URL:**
- `https://proview-cadence.vercel.app`
- OR your custom domain

**🔗 GitHub Repository:**
- `https://github.com/YOUR_USERNAME/proview-cadence-website`

**⚙️ Vercel Dashboard:**
- `https://vercel.com/dashboard`

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Website loads at Vercel URL
- [ ] All pages accessible (Home, Services, Projects, etc.)
- [ ] Images and assets loading correctly
- [ ] Admin panel works (requires authentication)
- [ ] AI Chatbot appears and responds
- [ ] WhatsApp button functional
- [ ] News ticker displays
- [ ] Navbar and mobile menu work
- [ ] Contact form functional

---

## 🔥 Pro Tips

1. **Branch Protection:** Set up branch protection on GitHub main branch
2. **Automatic Deployments:** Vercel auto-deploys on every push to main
3. **Preview Deployments:** Each pull request gets a preview URL
4. **Environment Variables:** Store sensitive data in Vercel environment variables
5. **Custom Domain:** Add your custom domain in Vercel dashboard

---

## 🆘 Troubleshooting

### Issue: Git push rejected
**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

### Issue: Vercel build fails
**Solution:**
```bash
# Check vercel logs
vercel logs

# Redeploy
vercel --prod --force
```

### Issue: API not working
**Solution:**
- Check `vercel.json` configuration
- Verify `api/data.py` exists
- Check Vercel function logs in dashboard

### Issue: Files too large
**Solution:**
```bash
# Add large files to .gitignore
echo "large-file.zip" >> .gitignore
git rm --cached large-file.zip
git commit -m "Remove large file"
git push origin main
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel logs: `vercel logs`
2. Visit Vercel Documentation: https://vercel.com/docs
3. GitHub Issues: Check your repository's Issues tab
4. Vercel Support: https://vercel.com/support

---

## 🎉 Success!

Your ProView Cadence website is now:
- ✅ Version controlled with Git
- ✅ Backed up on GitHub
- ✅ Live on Vercel
- ✅ Auto-deploys on updates
- ✅ Has SSL certificate (HTTPS)
- ✅ Globally distributed (CDN)

**Your website is now LIVE and accessible worldwide! 🌍**

---

Made with ❤️ by ProView Cadence
