# 🔒 Manual Security Fix - Step by Step

This guide provides simple commands to fix the exposed Google Maps API key security issue.

## 🚨 Problem
- Google Maps API key `AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4` was exposed in commit `853b082a`
- The key is visible in the repository history
- This poses a security risk

## ✅ Solution

### Step 1: Verify the Fix is Already Applied
The API key has already been removed from `env.template` and replaced with a placeholder.

```bash
# Check that the API key is no longer in env.template
grep -i "AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4" env.template
# Should return nothing (no matches)
```

### Step 2: Remove .env.local from Git Tracking
```bash
# Remove .env.local from Git tracking (if it exists)
git rm --cached .env.local 2>/dev/null || echo "No .env.local file found"
```

### Step 3: Clean Git History
```bash
# Create a backup branch first
git branch backup-before-security-fix

# Remove sensitive data from all commits
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env.local 2>/dev/null || true' \
    --prune-empty --tag-name-filter cat -- --all
```

### Step 4: Update Remote Repository
```bash
# Force push to update the remote repository
git push origin --force --all
```

### Step 5: Create New Commit
```bash
# Add all changes
git add .

# Create new commit
git commit -m "Security fix: Remove exposed API key from Git history

- Cleaned Git history to remove sensitive data
- Ensured all environment files are properly ignored
- Added comprehensive security documentation

BREAKING CHANGE: API key must be set in Vercel environment variables"

# Push the new commit
git push origin main
```

## 🔑 Critical Next Steps

### 1. Rotate the API Key (URGENT)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find the exposed API key: `AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4`
4. Click "Regenerate Key" or delete and create new
5. **Important**: The old key is now compromised and should not be used

### 2. Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with the new key
5. Redeploy the application

### 3. Test the Application
1. Verify the map loads correctly
2. Test all map functionality
3. Check browser console for errors

## 🛡️ Prevention for Future

### Environment File Security
- ✅ Never commit `.env.local` or `.env` files
- ✅ Always use `.env.template` with placeholder values
- ✅ Add `.env*` to `.gitignore` (already done)

### Pre-commit Checklist
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] All secrets in environment variables
- [ ] `.env*` files in `.gitignore`

## 🚀 Quick Commands Summary

```bash
# 1. Remove .env.local from tracking
git rm --cached .env.local 2>/dev/null || true

# 2. Clean Git history
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env.local 2>/dev/null || true' \
    --prune-empty --tag-name-filter cat -- --all

# 3. Force push to remote
git push origin --force --all

# 4. Create new commit
git add .
git commit -m "Security fix: Remove exposed API key from Git history"
git push origin main
```

## ⚠️ Important Notes

1. **The exposed API key must be rotated immediately**
2. **Never commit API keys to the repository again**
3. **Always use environment variables for sensitive data**
4. **Test the application after making changes**

## 📞 If You Need Help

If you encounter any issues:
1. Check the `SECURITY-GUIDE.md` for detailed information
2. Review the `.gitignore` file to ensure environment files are ignored
3. Verify the API key is properly set in Vercel environment variables

Remember: Security is everyone's responsibility! 🔒
