# 🚀 Vercel Deployment Guide for humzamalak.dev

## 📋 Pre-Deployment Checklist

### ✅ Code Updates Completed
- [x] Updated domain from `humzamalak.com` to `humzamalak.dev`
- [x] Updated metadata, Open Graph, and Twitter Card URLs
- [x] Updated structured data (JSON-LD) URLs
- [x] Updated sitemap base URL
- [x] Updated robots.txt sitemap URL
- [x] Created `.env.local` for local development
- [x] Enhanced PWA manifest with proper icons

### 🔧 Required Assets (Replace Placeholders)
- [ ] Replace `/public/og-image.jpg` with actual 1200x630 image
- [ ] Replace `/public/apple-touch-icon.png` with actual 180x180 image
- [ ] Ensure `/public/icon-192.png` and `/public/icon-512.png` are proper images
- [ ] Update favicon if needed

## 🚀 Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for deployment to humzamalak.dev"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository (`humza-portfolio`)
5. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables
In Vercel dashboard → Project Settings → Environment Variables, add:

```bash
# Analytics (Required)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Contact Form (Optional)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
EMAILJS_SERVICE_ID=your-emailjs-service-id
EMAILJS_TEMPLATE_ID=your-emailjs-template-id

# GitHub API (Optional)
GITHUB_TOKEN=your-github-token

# Custom Domain
NEXT_PUBLIC_SITE_URL=https://humzamalak.dev
```

### 4. Add Custom Domain
1. In Vercel dashboard → Domains
2. Add domain: `humzamalak.dev`
3. Add subdomain: `www.humzamalak.dev` (optional)
4. Update DNS records as instructed by Vercel:
   - A record: `@` → Vercel IP
   - CNAME record: `www` → `cname.vercel-dns.com`

### 5. SSL Certificate
- Vercel will automatically provision SSL certificate
- Wait 5-10 minutes for certificate to activate

## 🔍 Post-Deployment Verification

### 1. Domain Verification
- [ ] Visit `https://humzamalak.dev`
- [ ] Check SSL certificate is active
- [ ] Verify redirects work (www → non-www or vice versa)

### 2. SEO Verification
- [ ] Check sitemap: `https://humzamalak.dev/sitemap.xml`
- [ ] Check robots.txt: `https://humzamalak.dev/robots.txt`
- [ ] Verify meta tags with browser dev tools

### 3. Analytics Setup
- [ ] Create Google Analytics 4 property for `humzamalak.dev`
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add to Vercel environment variables
- [ ] Test analytics tracking

### 4. Search Console Setup
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://humzamalak.dev`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://humzamalak.dev/sitemap.xml`

## 🎯 Performance Optimization

### Lighthouse Score Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Run Performance Audit
```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run audit
lighthouse https://humzamalak.dev --output html --output-path ./lighthouse-report.html
```

## 🔒 Security & Monitoring

### Security Headers (Already Configured)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=63072000

### Monitoring Setup
1. **Vercel Analytics** (Free tier)
   - Performance monitoring
   - Real user metrics

2. **Error Tracking** (Optional)
   - Consider Sentry for error tracking
   - Monitor for 404s and 500s

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run build`
   - Verify environment variables
   - Review Vercel build logs

2. **Domain Not Working**
   - Check DNS propagation (can take 24-48 hours)
   - Verify DNS records match Vercel instructions
   - Check SSL certificate status

3. **Analytics Not Working**
   - Verify GA ID in environment variables
   - Check browser console for errors
   - Test with ad blockers disabled

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Analytics Help](https://support.google.com/analytics)

## 📈 Maintenance

### Regular Tasks
- [ ] Monitor Core Web Vitals
- [ ] Update dependencies monthly
- [ ] Review analytics data
- [ ] Check for broken links
- [ ] Update content as needed

### Backup Strategy
- [ ] GitHub repository (code backup)
- [ ] Export blog content
- [ ] Backup images/assets

---

**Deployment Date**: [Date]
**Domain**: humzamalak.dev
**Platform**: Vercel
**Next Review**: Monthly