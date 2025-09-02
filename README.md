# Humza Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Live Site
**Domain**: [humzamalak.dev](https://humzamalak.dev)

## 🛠 Tech Stack
- **Framework**: Next.js 15.5.2
- **Language**: TypeScript
- **Styling**: TailwindCSS + Framer Motion
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4
- **SEO**: Optimized meta tags, structured data, sitemap

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
./deploy-to-vercel.sh
```

## 📁 Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── (sections)/      # Page sections
│   ├── api/            # API routes
│   ├── blog/           # Blog pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
├── content/           # MDX blog content
├── data/              # Static data
├── lib/               # Utilities
└── types/             # TypeScript types
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
```bash
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SITE_URL=https://humzamalak.dev
```

### Customization
- Update `src/app/layout.tsx` for meta tags and SEO
- Modify `src/data/experience.ts` for experience data
- Add blog posts in `src/content/blog/`
- Customize styling in `tailwind.config.ts`

## 📊 Performance
- Lighthouse Score: 90+ (Performance, Accessibility, Best Practices, SEO)
- Optimized images with Next.js Image component
- Code splitting and tree shaking
- Static generation for blog posts

## 🔒 Security
- Security headers configured
- HTTPS enforced
- XSS protection
- Content Security Policy ready

## 📈 Analytics & SEO
- Google Analytics 4 integration
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card support

## 🚀 Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

Built with ❤️ by [Humza Malak](https://github.com/humzamalak)