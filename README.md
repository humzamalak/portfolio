# Humza Portfolio

A static-first Next.js portfolio deployed on **Cloudflare Pages**, with one Cloudflare Pages Function for the contact form.

## Local development

```bash
npm install
npm run dev
```

To exercise the production build and Pages runtime locally:

```bash
npm run cloudflare:dev
# http://localhost:8788
```

## Cloudflare deployment

1. Create a Pages project connected to this repository, or use Wrangler.
2. Set the build command to `npm run build` and the output directory to `out`.
3. Add `RESEND_API_KEY` as a secret in the Pages project settings. The recipient and sender defaults live in `wrangler.toml` and can be overridden there.
4. Deploy with:

```bash
npm run cloudflare:deploy
```

This publishes to production on humzamalak.dev. The Cloudflare project's production branch is `main`, so the script passes `--branch main`; without it, deploys from `master` become previews.

The contact endpoint is `/api/contact`, implemented in `functions/api/contact.ts`. It calls Resend from the edge, so the API key never reaches the browser.

## Architecture

- **Next.js static export**: `output: "export"` produces the `out/` directory.
- **Cloudflare Pages**: serves the static site and assets at the edge.
- **Pages Function**: handles `POST /api/contact` and validates the form before calling Resend.
- **Wrangler**: local Pages runtime and deployment CLI, configured by `wrangler.toml`.

## Verification

```bash
npm run lint
npm run build
```
