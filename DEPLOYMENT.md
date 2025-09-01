# Deployment & Hosting Setup Guide

## 🚀 Quick Start Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_GA_ID=your-google-analytics-id
     ```

4. **Custom Domain Setup**
   - In Vercel dashboard → Domains
   - Add your custom domain (e.g., humzamalak.com)
   - Update DNS records as instructed
   - SSL certificate will be auto-generated

### Option 2: Netlify

1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Connect your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

2. **Environment Variables**
   - In Netlify dashboard → Site Settings → Environment Variables
   - Add the same variables as Vercel

## 🔧 Environment Variables

Create a `.env.local` file for local development:

```bash
# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Contact Form
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id

# GitHub API (if needed)
GITHUB_TOKEN=your-github-token
```

## 📊 Analytics Setup

### Google Analytics 4

1. **Create GA4 Property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create new property
   - Get your Measurement ID (G-XXXXXXXXXX)

2. **Add to Environment**
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### Alternative: Plausible Analytics

For privacy-focused analytics:

1. **Sign up at [plausible.io](https://plausible.io)**
2. **Add script to layout.tsx:**
   ```html
   <script defer data-domain="humzamalak.com" src="https://plausible.io/js/script.js"></script>
   ```

## 🔒 Security & Performance

### Security Headers

The app includes security headers via `next.config.ts`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=63072000

### Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic with Next.js
- **Caching**: Static assets cached for 1 year
- **Compression**: Enabled in production

## 🧪 CI/CD Pipeline

### GitHub Actions

The `.github/workflows/ci.yml` file includes:

1. **Test Job**
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Build verification
   - Unit tests (if available)

2. **Preview Deployments**
   - Automatic deployment for PRs
   - Preview URLs for testing

3. **Production Deployments**
   - Automatic deployment on main branch
   - Environment variable injection

### Required Secrets

Add these to GitHub repository secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📈 Monitoring & Analytics

### Vercel Analytics

- Free tier available
- Performance monitoring
- Real user metrics

### Error Tracking

Optional: Add Sentry for error tracking:

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure in next.config.ts**
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');
   
   module.exports = withSentryConfig(nextConfig, {
     sentry: {
       hideSourceMaps: true,
     },
   });
   ```

## 🔍 SEO Verification

### Search Console Setup

1. **Google Search Console**
   - Add property: humzamalak.com
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: https://humzamalak.com/sitemap.xml

2. **Bing Webmaster Tools**
   - Add site to Bing Webmaster Tools
   - Submit sitemap

### SEO Checklist

- [x] Meta tags configured
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (JSON-LD)
- [x] Sitemap generated
- [x] Robots.txt configured
- [x] Canonical URLs set

## 🚀 Performance Optimization

### Lighthouse Score Targets

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimization Tips

1. **Images**
   - Use Next.js Image component
   - Optimize formats (WebP/AVIF)
   - Proper sizing

2. **Fonts**
   - Use `display: swap` for Google Fonts
   - Preload critical fonts

3. **JavaScript**
   - Code splitting
   - Tree shaking
   - Bundle analysis

## 🔄 Maintenance

### Regular Tasks

1. **Dependency Updates**
   ```bash
   npm audit
   npm update
   ```

2. **Performance Monitoring**
   - Check Core Web Vitals
   - Monitor Lighthouse scores
   - Review analytics data

3. **Security Updates**
   - Monitor security advisories
   - Update dependencies promptly
   - Review access logs

### Backup Strategy

1. **Code Backup**
   - GitHub repository
   - Regular commits

2. **Content Backup**
   - Export blog content
   - Backup images/assets

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Review build logs

2. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle size
   - Optimize images

3. **Analytics Not Working**
   - Verify GA ID
   - Check ad blockers
   - Review console errors

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Analytics Help](https://support.google.com/analytics)

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel/Netlify project created
- [ ] Environment variables configured
- [ ] Custom domain added
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] SEO verification complete
- [ ] Performance optimized
- [ ] Monitoring active
- [ ] Backup strategy in place

---

**Last Updated**: December 2024
**Next Review**: Quarterly
