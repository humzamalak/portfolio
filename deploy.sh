#!/bin/bash

# Deployment Script for Humza Portfolio
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

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
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not found. Please initialize git first."
    exit 1
fi

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm ci

# Step 2: Run linting
print_status "Running linting..."
npm run lint

# Step 3: Type checking
print_status "Running TypeScript type checking..."
npx tsc --noEmit

# Step 4: Build the application
print_status "Building the application..."
npm run build

# Step 5: Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're not on the main branch. Current branch: $CURRENT_BRANCH"
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled."
        exit 1
    fi
fi

# Step 6: Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes:"
    git status --short
    
    read -p "Do you want to commit these changes before deploying? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " COMMIT_MESSAGE
        git add .
        git commit -m "$COMMIT_MESSAGE"
        print_success "Changes committed."
    else
        print_warning "Deploying with uncommitted changes..."
    fi
fi

# Step 7: Push to remote
print_status "Pushing to remote repository..."
git push origin main

print_success "✅ Deployment script completed!"
print_status "Next steps:"
echo "1. Go to Vercel dashboard (https://vercel.com)"
echo "2. Import your GitHub repository"
echo "3. Configure environment variables"
echo "4. Add your custom domain"
echo "5. Deploy!"

print_status "For detailed instructions, see DEPLOYMENT.md"
