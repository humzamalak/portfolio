# Cloudflare Pages Deployment Guide

This guide outlines how to deploy the portfolio to Cloudflare Pages after migrating from Vercel.

## 📋 Prerequisites

- Cloudflare account
- GitHub repository connected to Cloudflare Pages
- Node.js 18.x or higher
- npm or yarn package manager

## 🛠️ Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.dev.vars` and fill in your actual values:

```bash
cp .dev.vars .dev.vars.local
# Edit .dev.vars.local with your actual credentials
```

Required environment variables:
- `RESEND_API_KEY` - Your Resend API key for email functionality
- `CONTACT_TO_EMAIL` - Email address to receive contact form submissions
- `CONTACT_FROM_EMAIL` - Verified sender email in Resend
- `CONTACT_FROM_NAME` - Display name for emails
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)
- `NEXT_PUBLIC_SITE_URL` - Your production domain

### 3. Run Development Server

```bash
# Standard Next.js development
npm run dev

# OR test with Cloudflare Workers locally
npm run build
npm run preview
```

### 4. Build for Cloudflare

```bash
# Build Next.js application
npm run build

# Build for Cloudflare Pages
npm run pages:build
```

## 🚀 Deployment to Cloudflare Pages

### Option 1: Automatic Deployment via GitHub (Recommended)

1. **Connect Repository to Cloudflare Pages**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to **Pages** → **Create a project**
   - Connect your GitHub account
   - Select the `humza-portfolio` repository

2. **Configure Build Settings**
   - **Framework preset:** Next.js
   - **Branch:** `main` (or your production branch)
   - **Build command:** `npm run build && npx @cloudflare/next-on-pages@1`
   - **Build output directory:** `.vercel/output/static`
   - **Root directory:** `/` (leave empty if root)
   - **Node version:** `18` or `20`

3. **Set Environment Variables**
   
   In Cloudflare Pages project settings → **Environment variables**, add:
   
   **Production:**
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_TO_EMAIL=humzatmalak@gmail.com
   CONTACT_FROM_EMAIL=onboarding@resend.dev
   CONTACT_FROM_NAME=Portfolio Contact
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_SITE_URL=https://humzamalak.dev
   ```
   
   **Preview (optional):**
   - Use the same values or separate test credentials

4. **Deploy**
   - Push to your main branch
   - Cloudflare Pages will automatically build and deploy
   - Deployment URL will be provided in the dashboard

### Option 2: Manual Deployment via Wrangler CLI

1. **Install Wrangler globally (optional)**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **Build and Deploy**
   ```bash
   npm run deploy
   ```

## 🔧 Configuration Files

### `wrangler.toml`
Cloudflare Workers/Pages configuration. Defines:
- Project name
- Compatibility date
- Build output directory

### `public/_headers`
HTTP headers for security and caching:
- Security headers (X-Frame-Options, CSP, etc.)
- Cache-Control for static assets
- API route headers

### `public/_redirects`
URL redirects (e.g., `/home → /`)

### `.dev.vars`
Local development environment variables (DO NOT COMMIT)

## 🌐 Custom Domain Setup

1. **Add Custom Domain in Cloudflare Pages**
   - Go to your Pages project
   - Navigate to **Custom domains**
   - Click **Set up a custom domain**
   - Enter `humzamalak.dev`

2. **DNS Configuration**
   - If domain is on Cloudflare: Automatic configuration
   - If domain is elsewhere: Add CNAME record pointing to your Pages URL

3. **SSL/TLS**
   - Cloudflare automatically provisions SSL certificates
   - Enable **Always Use HTTPS** in SSL/TLS settings

## 📧 Email Configuration (Resend)

The contact form uses Resend for email delivery. To configure:

1. **Get Resend API Key**
   - Sign up at [resend.com](https://resend.com)
   - Create an API key in your dashboard
   - Add key to environment variables as `RESEND_API_KEY`

2. **Verify Domain (Optional but Recommended)**
   - Add domain to Resend
   - Configure DNS records (SPF, DKIM, DMARC)
   - Use verified domain in `CONTACT_FROM_EMAIL`
   - If not verified, use `onboarding@resend.dev`

3. **Test Email Functionality**
   ```bash
   # Local testing
   npm run preview
   # Visit contact form and submit a test message
   ```

## 🔍 Monitoring & Debugging

### View Logs

Cloudflare Pages Dashboard → Your Project → **Deployments** → Click on deployment → **View build logs**

### Real-time Function Logs

- Go to **Functions** tab in your project
- View real-time logs for API routes
- Monitor errors and performance

### Analytics

Enable **Web Analytics** in Cloudflare Pages for:
- Page views
- Performance metrics
- Visitor insights

## 🚨 Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency issues
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** `@cloudflare/next-on-pages` build fails
**Solution:**
- Check Node.js version (18+ required)
- Verify `next.config.ts` has correct settings
- Review build logs for specific errors

### API Route Not Working

**Issue:** Contact form returns 500 error
**Solution:**
1. Verify environment variables are set in Cloudflare dashboard
2. Check that `export const runtime = 'edge'` is present in route file
3. Review function logs in Cloudflare dashboard
4. Test Resend API key is valid

### Images Not Loading

**Issue:** Images return 404 or don't display
**Solution:**
1. Verify images are in `/public` directory
2. Check `next.config.ts` has `images: { unoptimized: true }`
3. Use relative paths starting with `/` (e.g., `/image.jpg`)

### Headers Not Applied

**Issue:** Security headers missing in production
**Solution:**
1. Verify `public/_headers` file exists
2. Check syntax matches Cloudflare format
3. Clear Cloudflare cache: Dashboard → Caching → Purge Everything

## 📊 Performance Optimization

### Edge Caching

Static assets are automatically cached at Cloudflare's edge:
- JavaScript/CSS: 1 year
- Images: 1 year
- HTML: No cache (dynamic)

### Image Optimization

Since Next.js Image Optimization isn't available:
1. Pre-optimize images before committing
2. Use WebP format when possible
3. Consider Cloudflare Images product (paid)

### Bundle Size

Monitor and optimize:
```bash
npm run build
# Check output for bundle sizes
```

## 🔐 Security

### Environment Variables

- NEVER commit `.dev.vars` or actual credentials
- Use Cloudflare Pages dashboard for production secrets
- Rotate keys regularly

### Headers

Security headers are configured in `public/_headers`:
- HSTS for HTTPS enforcement
- CSP for XSS protection
- X-Frame-Options to prevent clickjacking

## 📝 Development Workflow

### Making Changes

1. Create feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test locally
   ```bash
   npm run dev
   npm run build
   npm run preview
   ```

3. Commit and push
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

4. Create Pull Request
   - Cloudflare Pages will create preview deployment
   - Review preview URL in PR comments
   - Merge when ready

5. Automatic Production Deployment
   - Merging to main triggers production deployment

## 🔄 Migration Checklist

- [x] Install `@cloudflare/next-on-pages` and `wrangler`
- [x] Update `next.config.ts` for Cloudflare compatibility
- [x] Create `public/_headers` for HTTP headers
- [x] Create `public/_redirects` for URL redirects
- [x] Create `wrangler.toml` configuration
- [x] Update `package.json` scripts
- [x] Delete `vercel.json`
- [x] Update API routes for edge runtime
- [x] Create `.dev.vars` for local environment
- [x] Update `.gitignore`
- [ ] Set up Cloudflare Pages project
- [ ] Configure environment variables in dashboard
- [ ] Connect custom domain
- [ ] Test contact form functionality
- [ ] Verify all pages load correctly
- [ ] Check analytics integration
- [ ] Update DNS records (if needed)

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages GitHub](https://github.com/cloudflare/next-on-pages)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Resend Documentation](https://resend.com/docs)

## 💬 Support

For issues specific to:
- **Cloudflare Pages:** [Cloudflare Community](https://community.cloudflare.com/)
- **Next.js:** [Next.js GitHub](https://github.com/vercel/next.js)
- **This Project:** Create an issue in the repository

---

**Last Updated:** September 30, 2025
