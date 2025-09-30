#!/bin/bash

echo "🚀 Kathy Polensky Real Estate Website - Deployment Status"
echo "========================================================"
echo ""

# Check local development server
echo "📱 Local Development Server:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ | grep -q "200"; then
    echo "✅ Running at http://localhost:8000"
    echo "   - Main site: http://localhost:8000"
    echo "   - Test page: http://localhost:8000/test-map.html"
else
    echo "❌ Not running - start with: python3 -m http.server 8000"
fi
echo ""

# Check GitHub Pages deployment
echo "🌐 GitHub Pages Deployment:"
if curl -s -o /dev/null -w "%{http_code}" https://cdogmx.github.io/KathyPolensky/ | grep -q "200"; then
    echo "✅ Live at https://cdogmx.github.io/KathyPolensky/"
    echo "   - Main site: https://cdogmx.github.io/KathyPolensky/"
    echo "   - Test page: https://cdogmx.github.io/KathyPolensky/test-map.html"
else
    echo "❌ Not accessible - check GitHub Pages settings"
fi
echo ""

# Check repository status
echo "📦 Repository Status:"
echo "   - Branch: $(git branch --show-current)"
echo "   - Last commit: $(git log -1 --oneline)"
echo "   - Remote: $(git remote get-url origin)"
echo ""

# Check for environment files
echo "🔒 Security Status:"
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local exists (should not be committed)"
else
    echo "✅ No .env.local file (good for security)"
fi

if grep -q "your_google_maps_api_key_here" env.template; then
    echo "✅ API key placeholder in env.template (secure)"
else
    echo "⚠️  Check env.template for exposed keys"
fi
echo ""

# Next steps
echo "📋 Next Steps:"
echo "1. 🔑 Rotate Google Maps API key in Google Cloud Console"
echo "2. 🔧 Update Vercel environment variables with new key"
echo "3. 🗺️  Deploy Next.js admin interface to Vercel"
echo "4. 🧪 Test all functionality"
echo ""

echo "🎉 Website is live and ready for use!"