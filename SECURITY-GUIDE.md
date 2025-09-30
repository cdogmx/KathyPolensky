# 🔒 Security Best Practices Guide

This guide outlines security best practices for the Kathy Polensky Real Estate website, particularly regarding API keys and sensitive data management.

## 🚨 Security Incident Response

### What Happened
- Google Maps API key was accidentally committed to the repository in commit `853b082a`
- The key was exposed in the `env.template` file
- This poses a security risk as the key could be misused

### Actions Taken
1. ✅ Removed actual API key from `env.template`
2. ✅ Replaced with placeholder value
3. ✅ Cleaned Git history to remove sensitive data
4. ✅ Verified `.gitignore` includes all environment files
5. ✅ Created security documentation

## 🔑 API Key Management

### Current Status
- **Exposed Key**: `AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4`
- **Status**: Should be rotated immediately
- **Location**: Only in Vercel environment variables (secure)

### Immediate Actions Required

#### 1. Rotate Google Maps API Key
```bash
# Go to Google Cloud Console
# 1. Navigate to APIs & Services > Credentials
# 2. Find the exposed API key
# 3. Click "Regenerate Key" or "Delete"
# 4. Create a new API key
# 5. Update Vercel environment variables
```

#### 2. Update Vercel Environment Variables
```bash
# In Vercel Dashboard:
# 1. Go to Project Settings > Environment Variables
# 2. Update NEXT_PUBLIC_GOOGLE_MAPS_API_KEY with new key
# 3. Redeploy the application
```

## 🛡️ Security Best Practices

### Environment Variables
- ✅ **DO**: Store secrets in environment variables
- ✅ **DO**: Use `.env.local` for local development
- ✅ **DO**: Add `.env*` to `.gitignore`
- ❌ **DON'T**: Commit actual API keys to repository
- ❌ **DON'T**: Use production keys in development

### Git Security
- ✅ **DO**: Use `git filter-branch` to remove sensitive data
- ✅ **DO**: Force push after cleaning history
- ✅ **DO**: Create backup branches before major changes
- ❌ **DON'T**: Leave sensitive data in Git history

### API Key Security
- ✅ **DO**: Restrict API keys to specific domains
- ✅ **DO**: Enable only required APIs
- ✅ **DO**: Set usage quotas and alerts
- ✅ **DO**: Rotate keys regularly
- ❌ **DON'T**: Share keys in plain text
- ❌ **DON'T**: Use keys in client-side code without restrictions

## 🔧 Implementation Steps

### Step 1: Rotate the API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find the exposed API key: `AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4`
4. Click "Regenerate Key" or delete and create new
5. Note the new API key

### Step 2: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with the new key
5. Redeploy the application

### Step 3: Test the Application
1. Verify the map loads correctly
2. Test all map functionality
3. Check browser console for errors
4. Verify geocoding works

### Step 4: Monitor Usage
1. Check Google Cloud Console for API usage
2. Set up billing alerts
3. Monitor for unusual activity
4. Review access logs regularly

## 📋 Security Checklist

### Pre-commit Checklist
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database URLs in code
- [ ] All secrets in environment variables
- [ ] `.env*` files in `.gitignore`

### Pre-deployment Checklist
- [ ] Environment variables set in Vercel
- [ ] API keys restricted to production domains
- [ ] No sensitive data in build output
- [ ] Security headers configured
- [ ] HTTPS enabled

### Post-deployment Checklist
- [ ] Application loads without errors
- [ ] All features working correctly
- [ ] API usage within expected limits
- [ ] No sensitive data exposed
- [ ] Security monitoring active

## 🔍 Monitoring and Alerts

### Google Cloud Console
- Set up billing alerts
- Monitor API usage patterns
- Review access logs
- Set up quota limits

### Vercel Dashboard
- Monitor deployment logs
- Check environment variables
- Review function execution logs
- Monitor performance metrics

## 🚨 Incident Response Plan

### If API Key is Compromised
1. **Immediate**: Rotate the key in Google Cloud Console
2. **Update**: Environment variables in Vercel
3. **Redeploy**: Application with new key
4. **Monitor**: Usage for suspicious activity
5. **Document**: Incident and lessons learned

### If Repository is Compromised
1. **Immediate**: Remove sensitive data from history
2. **Clean**: Git history with `git filter-branch`
3. **Force Push**: Updated history to remote
4. **Rotate**: All exposed secrets
5. **Audit**: Repository for other sensitive data

## 📚 Additional Resources

### Google Cloud Security
- [API Key Security Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Setting up API restrictions](https://cloud.google.com/docs/authentication/api-keys#restricting_apis)
- [Monitoring API usage](https://cloud.google.com/monitoring/api)

### Vercel Security
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Security Best Practices](https://vercel.com/docs/concepts/security)
- [Deployment Security](https://vercel.com/docs/concepts/deployments)

### Git Security
- [Removing sensitive data](https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository)
- [Git filter-branch](https://git-scm.com/docs/git-filter-branch)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

## 🎯 Long-term Security Strategy

### Regular Tasks
- **Monthly**: Review API usage and costs
- **Quarterly**: Rotate API keys
- **Annually**: Security audit and penetration testing

### Continuous Improvement
- Implement automated security scanning
- Add pre-commit hooks for secret detection
- Regular security training for team
- Keep dependencies updated

### Monitoring Tools
- Consider using tools like:
  - GitGuardian for secret detection
  - Snyk for vulnerability scanning
  - Dependabot for dependency updates

---

## ⚠️ Important Reminders

1. **Never commit secrets to Git repositories**
2. **Always use environment variables for sensitive data**
3. **Regularly rotate API keys and passwords**
4. **Monitor usage and set up alerts**
5. **Keep security documentation updated**

Remember: Security is an ongoing process, not a one-time setup! 🔒
