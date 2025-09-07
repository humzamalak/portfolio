#!/bin/bash

# Email Functionality Demo Script
# This script demonstrates the email functionality testing

echo "🚀 Email Functionality Testing Demo"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Step 1: Checking Environment Setup"
echo "--------------------------------------"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    
    # Check for required environment variables
    if grep -q "RESEND_API_KEY" .env.local; then
        echo "✅ RESEND_API_KEY is set"
    else
        echo "⚠️  RESEND_API_KEY not found in .env.local"
    fi
    
    if grep -q "CONTACT_TO_EMAIL" .env.local; then
        echo "✅ CONTACT_TO_EMAIL is set"
    else
        echo "⚠️  CONTACT_TO_EMAIL not found in .env.local"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Please create it with your Resend API key and email settings"
    exit 1
fi

echo ""
echo "📦 Step 2: Installing Dependencies"
echo "---------------------------------"
npm install

echo ""
echo "🧪 Step 3: Running Unit Tests (Email Utils)"
echo "--------------------------------------------"
npm run test:unit

echo ""
echo "🔌 Step 4: Running API Tests"
echo "----------------------------"
npm run test:api

echo ""
echo "⚛️  Step 5: Running Component Tests"
echo "----------------------------------"
npm run test:component

echo ""
echo "🔄 Step 6: Running Integration Tests"
echo "-----------------------------------"
npm run test:integration

echo ""
echo "📊 Step 7: Running Coverage Report"
echo "----------------------------------"
npm run test:coverage

echo ""
echo "🌐 Step 8: Starting Development Server"
echo "-------------------------------------"
echo "Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo "Scroll to the contact section and test the form manually"
echo ""
echo "Press Ctrl+C to stop the server when done testing"
echo ""

# Start the development server
npm run dev
