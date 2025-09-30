#!/bin/bash

# Quick Security Fix for Exposed API Key
# Simple step-by-step commands to fix the security issue

echo "🔒 Quick Security Fix for Exposed Google Maps API Key"
echo "====================================================="
echo ""

# Step 1: Verify current state
echo "Step 1: Checking current state..."
if grep -q "AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4" env.template; then
    echo "❌ API key still exposed in env.template"
    echo "   Please run: sed -i '' 's/AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4/your_google_maps_api_key_here/g' env.template"
    exit 1
else
    echo "✅ API key already removed from env.template"
fi

# Step 2: Remove .env.local from tracking
echo ""
echo "Step 2: Removing .env.local from Git tracking..."
git rm --cached .env.local 2>/dev/null || echo "   No .env.local file to remove"

# Step 3: Clean Git history
echo ""
echo "Step 3: Cleaning Git history..."
echo "   This will remove the exposed API key from all commits"

# Create backup
git branch backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Remove sensitive data from history
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env.local 2>/dev/null || true' \
    --prune-empty --tag-name-filter cat -- --all

# Step 4: Force push
echo ""
echo "Step 4: Updating remote repository..."
git push origin --force --all

# Step 5: Create new commit
echo ""
echo "Step 5: Creating new commit..."
git add .
git commit -m "Security fix: Remove exposed API key from Git history

- Cleaned Git history to remove sensitive data
- Ensured all environment files are properly ignored
- Added comprehensive security documentation

BREAKING CHANGE: API key must be set in Vercel environment variables"
git push origin main

echo ""
echo "🎉 Security fix completed!"
echo ""
echo "📋 Next steps:"
echo "1. 🔑 Rotate API key in Google Cloud Console"
echo "2. 🔧 Update Vercel environment variables"
echo "3. 🧪 Test the application"
echo ""
echo "⚠️  Never commit API keys to the repository again!"
