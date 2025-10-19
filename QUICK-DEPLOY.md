# 🚀 Quick Deploy Guide - ProView Cadence

## Two Methods: Automated Script OR Manual Commands

---

## 🎯 Method 1: One-Click Automated Deployment (EASIEST!)

### Step 1: Run the deployment script
```bash
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
./deploy.sh
```

The script will:
- ✅ Initialize Git repository
- ✅ Commit all files
- ✅ Ask for your GitHub username and repo name
- ✅ Push to GitHub
- ✅ Deploy to Vercel
- ✅ Create an update script for future changes

**That's it! Your site will be live!**

---

## 🛠️ Method 2: Manual Step-by-Step (Full Control)

### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Verify installations
git --version
vercel --version
```

### Step 1: Navigate to Project
```bash
cd "/home/debjitdebbarman/Desktop/NICT Computer Services"
```

### Step 2: Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit: ProView Cadence website with AI chatbot"
```

### Step 3: Create GitHub Repository

**Go to:** https://github.com/new

**Create a new repository:**
- Name: `proview-cadence-website`
- Visibility: Public
- **DON'T** initialize with README

**Then run:**
```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/proview-cadence-website.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Follow the prompts:**
- Scope: Select your account
- Link to existing project: No
- Project name: Press Enter or type a name
- Directory: ./ (press Enter)
- Override settings: No

---

## 🔄 Future Updates

### Option A: Use Update Script (Created automatically)
```bash
./update-deploy.sh
```

### Option B: Manual Update
```bash
# Make your changes, then:
git add .
git commit -m "Your update message"
git push origin main
vercel --prod
```

**Note:** Vercel auto-deploys when you push to GitHub (after initial setup)!

---

## 📱 Your Live URLs

After deployment:

**🌍 Production Website:**
```
https://proview-cadence.vercel.app
```
(or your custom domain)

**📦 GitHub Repository:**
```
https://github.com/YOUR_USERNAME/proview-cadence-website
```

**⚙️ Vercel Dashboard:**
```
https://vercel.com/dashboard
```

---

## ✅ What to Verify After Deployment

- [ ] Website loads correctly
- [ ] All images display
- [ ] AI Chatbot works
- [ ] WhatsApp button functional
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)

---

## 🎨 What's Included

✅ **Dynamic Website** with real-time updates
✅ **AI Chatbot** with intelligent responses
✅ **Admin Panel** for content management
✅ **WhatsApp Integration**
✅ **News Ticker**
✅ **Projects Showcase**
✅ **Responsive Design**
✅ **Serverless API** for data management

---

## 🆘 Common Issues

### "Permission denied" when running script
```bash
chmod +x deploy.sh
./deploy.sh
```

### Git push rejected
```bash
git pull origin main --rebase
git push origin main
```

### Vercel not installed
```bash
npm install -g vercel
```

### Need to reinstall Node.js
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 💡 Pro Tips

1. **Custom Domain:** Add in Vercel dashboard → Settings → Domains
2. **Environment Variables:** Vercel dashboard → Settings → Environment Variables
3. **Analytics:** Enable in Vercel dashboard for visitor insights
4. **Preview Deployments:** Every branch push gets a preview URL
5. **Automatic HTTPS:** Vercel provides SSL certificates automatically

---

## 📞 Need Help?

Read the full guide: `DEPLOYMENT-GUIDE.md`

Or contact:
- Email: contact@proviewcadence.com
- GitHub Issues: Your repository's Issues tab

---

**🎉 Happy Deploying!**

Your ProView Cadence website will be live and accessible worldwide in minutes!
