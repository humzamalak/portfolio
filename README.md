# Humza Malak Portfolio

A cinematic DevOps portfolio built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. The site is deployed on **Netlify** and includes a production contact form powered by Resend.

**Live site:** <https://humzamalak.dev>

## Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript / React 19
- **Styling:** Tailwind CSS, custom design tokens, Framer Motion
- **Contact form:** Next.js API route locally, Netlify Function in production, Resend for email delivery
- **Testing:** Jest + Testing Library, Cypress for E2E coverage
- **Deployment:** Netlify / OpenNext adapter

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Useful commands:

```bash
npm run lint              # ESLint
npm test -- --runInBand   # Jest suite
npm run build             # Production build
npm run netlify:dev       # Netlify local runtime, including functions
```

## Environment variables

Create `.env.local` for local development. Keep real values out of git.

```bash
# Public browser-safe values
NEXT_PUBLIC_SITE_URL=https://humzamalak.dev
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Server-only contact form values
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=your-inbox@example.com
CONTACT_FROM_EMAIL=verified-sender@example.com
CONTACT_FROM_NAME="Portfolio Contact"
```

Notes:

- `RESEND_API_KEY` must be configured in Netlify for the production contact form.
- `CONTACT_FROM_EMAIL` must be a Resend-verified sender/domain. Use `onboarding@resend.dev` only for test-mode validation.
- `NEXT_PUBLIC_*` variables are exposed to the browser; never put secrets in them.

## Netlify deployment

This repository is configured for Netlify’s modern Next.js support. Netlify detects Next.js and runs it through the OpenNext adapter, which handles App Router pages, route handlers, SSR/ISR, image optimization, and cache behavior.

### Recommended: Netlify Git integration

1. Push the branch to GitHub.
2. In Netlify, create or connect the site from the GitHub repository.
3. Use these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** `20`
4. Add the environment variables listed above in **Site configuration → Environment variables**.
5. Deploy from the Netlify dashboard.
6. After deploy, test:
   - home page loads
   - `/projects` loads
   - `/blog` redirects to Medium
   - contact form returns a success/error state without exposing secrets
   - response/security headers are present

### GitHub Actions deployment

The workflow at `.github/workflows/ci.yml` validates every push/PR and deploys via Netlify when the required secrets are available.

Add these GitHub Actions secrets if you want Actions-driven deploys:

```bash
NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
```

The workflow:

- installs with `npm ci`
- runs lint, typecheck, Jest, and build
- deploys previews for pull requests when Netlify secrets are present
- deploys production on pushes to `main` when Netlify secrets are present

If you use the Netlify dashboard Git integration instead, the GitHub Actions deploy steps can remain idle; Netlify will still build from pushes.

### Manual CLI deployment

For a local one-off deploy:

```bash
npm run netlify:login      # first time only
npm run netlify:deploy     # runs a production deploy with Netlify build
```

Preview without production promotion:

```bash
npx netlify deploy --build
```

Validate repository wiring before deploying:

```bash
node scripts/validate-netlify.js
npm run build
```

## Contact form routing

The frontend chooses the endpoint by environment:

- local development: `/api/contact`
- production build: `/.netlify/functions/contact`

The Netlify Function lives at `netlify/functions/contact.js` and mirrors the Next.js API route behavior.

## Repository map

```text
src/app/                     Next.js App Router pages, metadata, and sections
src/app/(sections)/          Homepage sections
src/app/api/contact/         Local/dev contact API route
src/components/              Shared UI and layout components
src/data/                    Experience/project/static data
src/lib/                     Medium/contact utilities
src/__tests__/               Jest unit and integration tests
cypress/e2e/                 Browser/E2E tests
netlify/functions/contact.js Production contact function
scripts/validate-netlify.js  Deployment sanity checks
netlify.toml                 Netlify build, headers, and redirects
```

## Production checklist

Before promoting a deploy:

```bash
npm run lint
npm test -- --runInBand
npm run build
node scripts/validate-netlify.js
```

Then verify in the deployed site:

- HTTPS and custom domain are active.
- Main navigation and section anchors work.
- Medium links point to `https://medium.com/@humzamalak`.
- Contact form works with configured Resend credentials.
- No secrets appear in build logs or browser console.

## Troubleshooting

### Build fails on Netlify

- Confirm Node version is `20`.
- Run `npm ci && npm run build` locally.
- Clear Netlify build cache and redeploy.
- Check that all required environment variables exist in Netlify.

### Contact form fails

- Confirm `RESEND_API_KEY` is set in Netlify.
- Confirm `CONTACT_FROM_EMAIL` is verified in Resend.
- Check Netlify Function logs for `contact`.
- Test locally with `npm run netlify:dev`.

### GitHub Actions deploy does not run

- Confirm `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` are set.
- Confirm the branch matches the workflow rules in `.github/workflows/ci.yml`.
- If using Netlify dashboard deployments, this is optional.
