# 🚀 Deploy Next.js Admin Interface to Vercel

This guide will help you deploy the Next.js admin interface with Google Maps integration to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com) (free tier available)
- [Google Cloud Console](https://console.cloud.google.com) access
- [Vercel Postgres Database](https://vercel.com/storage/postgres) (free tier)

## 🔧 Step 1: Set Up Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to "Storage" → "Create Database" → "Postgres"
3. Choose "Hobby" plan (free tier)
4. Name: `kathy-polensky-db`
5. Region: Choose closest to your users (e.g., `us-east-1`)
6. Copy the connection string (starts with `postgresql://`)

## 🔑 Step 2: Rotate Google Maps API Key

**CRITICAL**: The exposed API key must be rotated immediately!

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find the exposed key: `AIzaSyDRCCnT3EZoE7tw8muJT-sqYiOBnQKKgh4`
4. Click "Regenerate Key" or delete and create new
5. **Restrict the new key**:
   - Application restrictions: HTTP referrers
   - Add domains: `*.vercel.app`, `kathypolensky.com`
6. Note the new API key

## ⚡ Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `cdogmx/KathyPolensky`
4. Choose "Next.js" framework
5. Root Directory: Leave empty
6. Click "Deploy"

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? kathy-polensky-admin
# - Directory? ./
# - Override settings? No
```

## 🔧 Step 4: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Authentication
ADMIN_PASSWORD="kathy-admin-2024"
ADMIN_TOKEN="kathy-admin-2024"

# Google Maps API (NEW KEY)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_new_api_key_here"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-project.vercel.app"
```

## 🗄️ Step 5: Set Up Database Schema

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

## 🧪 Step 6: Test the Deployment

### Test Admin Interface
1. Visit: `https://your-project.vercel.app/admin`
2. Login with: `admin` / `kathy-admin-2024`
3. Test adding listings
4. Test bulk CSV upload

### Test Property Map
1. Visit: `https://your-project.vercel.app/listings-map`
2. Verify map loads with Google Maps
3. Test all filters and markers
4. Test geocoding

## 🔗 Step 7: Update Static Site Links

Update the static site to link to your Vercel deployment:

1. Edit `integrate-map.js`
2. Update the URLs:
```javascript
const adminUrl = 'https://your-project.vercel.app/admin';
const mapUrl = 'https://your-project.vercel.app/listings-map';
```

3. Commit and push changes:
```bash
git add .
git commit -m "Update links to Vercel deployment"
git push origin main
```

## 📊 Step 8: Monitor and Verify

### Check Deployment Status
```bash
# Run the deployment check script
./check-deployment.sh
```

### Verify All Components
- [ ] Static site loads correctly
- [ ] Admin interface accessible
- [ ] Property map displays
- [ ] Google Maps API working
- [ ] Database operations working
- [ ] All forms functional

## 🚨 Troubleshooting

### Common Issues

#### Map Not Loading
- Check API key is correct
- Verify API key restrictions
- Check browser console for errors

#### Database Connection Failed
- Verify DATABASE_URL format
- Check Vercel Postgres status
- Test with Prisma Studio

#### Admin Login Not Working
- Check ADMIN_PASSWORD setting
- Verify environment variables
- Check deployment logs

### Debug Commands
```bash
# Check Vercel deployment logs
vercel logs

# Test database connection
npx prisma studio

# Check environment variables
vercel env ls
```

## 🎉 Success!

Once deployed, you'll have:

✅ **Static Marketing Site** - https://cdogmx.github.io/KathyPolensky/  
✅ **Admin Interface** - https://your-project.vercel.app/admin  
✅ **Property Map** - https://your-project.vercel.app/listings-map  
✅ **Database Integration** - Vercel Postgres with Prisma  
✅ **Google Maps** - Interactive map with filtering  

The complete real estate website system is now live and ready for production use! 🏠✨
