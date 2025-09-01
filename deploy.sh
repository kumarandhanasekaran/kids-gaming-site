#!/bin/bash

# Kids Gaming Site - Deployment Script
# Automates GitHub repository creation and GitHub Pages deployment

echo "🚀 Kids Gaming Site - GitHub Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the kids-gaming-site directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git branch -m main
fi

# Add and commit files if there are changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Adding and committing files..."
    git add .
    git commit -m "Update: Kids Gaming Site with HERE AND NOW AI branding"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "============="
echo ""
echo "1. First, authenticate with GitHub CLI:"
echo "   gh auth login"
echo ""
echo "2. Then create the repository and push:"
echo "   gh repo create kids-gaming-site --public --source=. --push"
echo ""
echo "3. Enable GitHub Pages:"
echo "   gh repo edit --homepage 'https://YOUR_USERNAME.github.io/kids-gaming-site'"
echo ""
echo "4. Set up GitHub Pages deployment:"
echo "   - Go to your repository on GitHub"
echo "   - Navigate to Settings → Pages"
echo "   - Under 'Source', select 'GitHub Actions'"
echo ""
echo "5. Your site will be available at:"
echo "   https://YOUR_USERNAME.github.io/kids-gaming-site"
echo ""
echo "🎯 Automated deployment workflow has been created in .github/workflows/gh-pages.yml"
echo "🔧 The .nojekyll file has been added for proper static file serving"
echo ""
echo "✅ Project is ready for deployment!"
echo ""
echo "💡 TIP: Replace 'YOUR_USERNAME' with your actual GitHub username"
