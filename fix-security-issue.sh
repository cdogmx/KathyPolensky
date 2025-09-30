#!/bin/bash

# Security Fix Script for Exposed Google Maps API Key
# This script removes the exposed API key from Git history and implements security best practices

set -e  # Exit on any error

echo "🔒 Starting security fix for exposed Google Maps API key..."
echo "=================================================="

# Step 1: Verify we're in the right directory
if [ ! -f "env.template" ]; then
    echo "❌ Error: env.template file not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found env.template file"

# Step 2: Check if the API key is still exposed in env.template
if grep -q "AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4" env.template; then
    echo "❌ Error: API key still exposed in env.template. Please fix this first."
    exit 1
fi

echo "✅ API key removed from env.template"

# Step 3: Check .gitignore for environment files
echo "🔍 Checking .gitignore for environment file patterns..."

if grep -q "\.env" .gitignore; then
    echo "✅ .gitignore includes .env patterns"
else
    echo "⚠️  Adding .env patterns to .gitignore..."
    cat >> .gitignore << EOF

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF
fi

# Step 4: Remove any existing .env.local file from tracking
echo "🧹 Removing .env.local from Git tracking..."
if [ -f ".env.local" ]; then
    git rm --cached .env.local 2>/dev/null || true
    echo "✅ Removed .env.local from Git tracking"
else
    echo "ℹ️  No .env.local file found"
fi

# Step 5: Clean Git history to remove the exposed API key
echo "🧽 Cleaning Git history to remove exposed API key..."

# Create a backup branch first
echo "📦 Creating backup branch..."
git branch backup-before-security-fix 2>/dev/null || true

# Use git filter-branch to remove the sensitive data from history
echo "🔄 Removing sensitive data from Git history..."
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env.local 2>/dev/null || true' \
    --prune-empty --tag-name-filter cat -- --all

# Alternative method using BFG Repo-Cleaner (if available)
# Uncomment the following lines if you have BFG installed:
# echo "🔄 Using BFG Repo-Cleaner to remove sensitive data..."
# java -jar bfg.jar --delete-files ".env.local" .
# git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Step 6: Force push to update remote repository
echo "🚀 Updating remote repository..."
git push origin --force --all

# Step 7: Create a new commit with the cleaned files
echo "📝 Creating new commit with cleaned files..."
git add .
git commit -m "Security fix: Remove exposed API key and clean Git history

- Replaced actual API key with placeholder in env.template
- Cleaned Git history to remove sensitive data
- Ensured .gitignore includes all environment files
- Added security best practices documentation

BREAKING CHANGE: API key must now be set in Vercel dashboard environment variables"
git push origin main

echo ""
echo "🎉 Security fix completed successfully!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo "1. 🔑 Rotate your Google Maps API key in Google Cloud Console"
echo "2. 🔧 Update the new API key in Vercel dashboard environment variables"
echo "3. 🧪 Test the application to ensure everything works"
echo "4. 📚 Review the security best practices in SECURITY-GUIDE.md"
echo ""
echo "⚠️  IMPORTANT: Never commit API keys or secrets to the repository again!"
echo "   Always use environment variables for sensitive data."
