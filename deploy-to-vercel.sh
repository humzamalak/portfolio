#!/bin/bash

# 🚀 Deploy to Vercel Script for humzamalak.dev
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please initialize git first."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them first."
    echo "Current changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Auto-commit before deployment"
        print_success "Changes committed"
    else
        print_error "Please commit your changes before deploying"
        exit 1
    fi
fi

# Run pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if build works
print_status "Building project..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed. Please fix the issues before deploying."
    exit 1
fi

# Check linting
print_status "Running linting..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting issues found. Consider fixing them."
fi

# Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Code pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
if vercel --prod; then
    print_success "Deployment successful!"
    print_success "Your site should be available at: https://humzamalak.dev"
else
    print_error "Deployment failed"
    exit 1
fi

# Post-deployment checklist
echo ""
print_status "Post-deployment checklist:"
echo "1. ✅ Visit https://humzamalak.dev to verify the site is live"
echo "2. 🔍 Check SSL certificate is active"
echo "3. 📊 Set up Google Analytics (if not already done)"
echo "4. 🔍 Submit sitemap to Google Search Console"
echo "5. 📱 Test on mobile devices"
echo "6. 🚀 Run Lighthouse audit for performance"

print_success "Deployment complete! 🎉"