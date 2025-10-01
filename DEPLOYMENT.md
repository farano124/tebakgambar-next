# 🚀 Deployment Guide - Tebak Gambar Next.js

This guide will help you deploy your Tebak Gambar Next.js application to production.

## 📋 Prerequisites

- ✅ Supabase project created and configured
- ✅ Database migrations run
- ✅ Environment variables configured
- ✅ Application tested locally

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

#### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/tebakgambar-next)

#### Manual Deploy
1. **Connect Repository:**
   ```bash
   # If using GitHub/GitLab
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### Option 2: Netlify

1. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables:**
   Same as Vercel configuration above

3. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Option 3: Railway

1. **Connect Repository:**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Connect GitHub repository

2. **Environment Variables:**
   Same configuration as above

3. **Automatic Deployment:**
   Railway will auto-deploy on git push

### Option 4: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Create new app from repository

2. **Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: .next
   ```

3. **Environment Variables:**
   Configure same variables as above

## 🗄️ Database Setup for Production

### Method 1: Using Supabase Dashboard (Easiest)

1. **Open Supabase SQL Editor:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run Migrations in Order:**
   ```sql
   -- Copy and paste each migration file content in this order:
   -- 1. database/migrations/001_initial_schema.sql
   -- 2. database/migrations/002_seed_data.sql
   ```

3. **Verify Setup:**
   ```sql
   SELECT COUNT(*) FROM levels;  -- Should return 100
   SELECT COUNT(*) FROM users;   -- Should return your user count
   ```

### Method 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.local` file in production with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Next.js Configuration
NODE_ENV=production
```

### Security Notes

- ✅ **Never commit `.env.local`** to version control
- ✅ **Use different keys** for development and production
- ✅ **Restrict service role key** usage to admin operations only
- ✅ **Enable Row Level Security** in Supabase for additional protection

## 🚀 Post-Deployment Checklist

### 1. Test Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Session persistence works

### 2. Test Game Functionality
- [ ] Level loading works
- [ ] Answer validation works
- [ ] Progress tracking works
- [ ] Image serving works

### 3. Test Admin Features
- [ ] Admin login works
- [ ] User management works
- [ ] Admin panel accessible

### 4. Performance & SEO
- [ ] Page loads are fast (< 3 seconds)
- [ ] Images load properly
- [ ] Mobile responsive
- [ ] SEO meta tags present

### 5. Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] No sensitive data exposed
- [ ] Rate limiting active

## 🔍 Monitoring & Maintenance

### Vercel Analytics
Vercel provides built-in analytics. Check:
- Response times
- Error rates
- User traffic
- Core Web Vitals

### Supabase Monitoring
Monitor your database:
- Query performance
- Error logs
- User activity
- Storage usage

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor error logs weekly
- [ ] Backup database regularly
- [ ] Test critical user flows

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Authentication Issues
- Check Supabase project settings
- Verify environment variables
- Check Supabase Auth configuration

#### Database Connection Issues
- Verify connection string format
- Check firewall settings
- Confirm database credentials

#### Image Loading Issues
- Check image API route
- Verify file paths
- Check Supabase storage permissions

## 📞 Support

If you encounter issues:

1. **Check the logs** in your deployment platform
2. **Verify environment variables** are correct
3. **Test locally** with production environment variables
4. **Check Supabase dashboard** for database issues
5. **Review this documentation** for common solutions

## 🎉 Success!

Once deployed and tested, your **Tebak Gambar Next.js application** will be live and ready for users! 🎮🇮🇩

### Share Your App
- Post on social media
- Share with Indonesian developer communities
- Add to your portfolio
- Consider open-sourcing the code

**Happy deploying! 🚀**