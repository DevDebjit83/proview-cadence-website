#!/bin/bash

# ============================================
# ProView Cadence - Quick Deploy Script
# Deploys to GitHub and Vercel in one go!
# ============================================

echo "╔═══════════════════════════════════════════════╗"
echo "║   ProView Cadence Deployment Script          ║"
echo "║   GitHub + Vercel Auto-Deploy                 ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if in correct directory
if [ ! -f "index.html" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Starting deployment process..."
echo ""

# Step 1: Git Setup
print_info "Step 1: Setting up Git repository..."

if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Step 2: Add all files
print_info "Step 2: Adding files to Git..."
git add .
print_success "Files staged for commit"

# Step 3: Commit
print_info "Step 3: Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update: ProView Cadence website deployment"
fi

git commit -m "$commit_msg"
print_success "Changes committed"

# Step 4: GitHub Setup
print_info "Step 4: Setting up GitHub remote..."
echo ""
print_warning "Have you created a repository on GitHub?"
echo "If not, go to: https://github.com/new"
echo ""

read -p "Enter your GitHub username: " github_username
read -p "Enter your repository name (e.g., proview-cadence-website): " repo_name

if [ -z "$github_username" ] || [ -z "$repo_name" ]; then
    print_error "Username and repository name are required"
    exit 1
fi

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    print_warning "Remote 'origin' already exists. Updating..."
    git remote set-url origin "https://github.com/$github_username/$repo_name.git"
else
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

print_success "GitHub remote configured"

# Step 5: Push to GitHub
print_info "Step 5: Pushing to GitHub..."
git branch -M main

if git push -u origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_warning "Push failed. You might need to authenticate or check your repository."
    echo "Try running: git push -u origin main"
fi

echo ""
print_info "═══════════════════════════════════════════════"
print_success "GitHub Deployment Complete!"
print_info "═══════════════════════════════════════════════"
echo ""

# Step 6: Vercel Deployment
print_info "Step 6: Deploying to Vercel..."
echo ""

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed."
    echo "Install it with: npm install -g vercel"
    echo ""
    read -p "Do you want to skip Vercel deployment for now? (y/n): " skip_vercel
    
    if [ "$skip_vercel" != "y" ]; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    else
        print_info "Skipping Vercel deployment. You can deploy later with: vercel --prod"
        exit 0
    fi
fi

print_info "Logging in to Vercel..."
vercel login

print_info "Deploying to Vercel production..."
vercel --prod

echo ""
print_info "═══════════════════════════════════════════════"
print_success "Deployment Complete! 🎉"
print_info "═══════════════════════════════════════════════"
echo ""
print_success "Your website is now live!"
print_info "GitHub: https://github.com/$github_username/$repo_name"
print_info "Vercel: Check the URL provided above"
echo ""
print_info "Future updates: Just run this script again!"
echo ""

# Create a simple update script
cat > update-deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Quick Update & Deploy"
git add .
read -p "Commit message: " msg
git commit -m "$msg"
git push origin main
vercel --prod
echo "✅ Deployed!"
EOF

chmod +x update-deploy.sh
print_success "Created 'update-deploy.sh' for future quick updates!"

exit 0
