#!/bin/bash

echo "🚀 Checking Kathy Polensky Website Deployment Status"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project files found"

# Check git status
echo ""
echo "📋 Git Status:"
git status --porcelain
if [ $? -eq 0 ]; then
    echo "✅ Git repository is clean"
else
    echo "❌ Git issues detected"
fi

# Check if we can reach GitHub
echo ""
echo "🌐 Checking GitHub connectivity:"
if curl -s --head https://github.com/cdogmx/KathyPolensky | head -n 1 | grep -q "200 OK"; then
    echo "✅ GitHub repository is accessible"
else
    echo "❌ Cannot reach GitHub repository"
fi

# Check local server
echo ""
echo "🏠 Local Development Server:"
if curl -s --head http://localhost:8000 | head -n 1 | grep -q "200 OK"; then
    echo "✅ Local server is running at http://localhost:8000"
else
    echo "❌ Local server is not running"
    echo "   Run: python3 -m http.server 8000"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Visit: https://github.com/cdogmx/KathyPolensky/settings/pages"
echo "2. Enable GitHub Pages (Deploy from branch: main, folder: / (root))"
echo "3. Wait 5-10 minutes for deployment"
echo "4. Visit: https://cdogmx.github.io/KathyPolensky/"
echo "5. Test page: https://cdogmx.github.io/KathyPolensky/test-deployment.html"

echo ""
echo "📱 Local Testing:"
echo "   Main site: http://localhost:8000"
echo "   Test page: http://localhost:8000/test-deployment.html"
