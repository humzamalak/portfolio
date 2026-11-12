# Humza Portfolio

The source for [humzamalak.dev](https://humzamalak.dev), the personal site of Humza Malak. It is a static-first Next.js site deployed on **Cloudflare Pages**, with one Cloudflare Pages Function for the contact form.

## What the site contains

| Path | Content | Source |
| --- | --- | --- |
| `/` | Home page: introduction, experience, projects, newest notes and contact form | `src/app/home-page.tsx`, `src/data/` |
| `/work/<slug>/` | Case studies | `src/data/case-studies.ts` |
| `/projects/` | Project list | `src/data/projects.ts` |
| `/notes/` and `/notes/<slug>/` | Field notes written in Markdown | `content/notes/` |
| `/rss.xml` | RSS feed of published notes | `src/app/rss.xml/` |
| `/privacy/`, `/terms/` | Privacy policy and terms | `src/app/privacy/`, `src/app/terms/` |
| `/api/contact` | Contact form endpoint (Pages Function) | `functions/api/contact.ts` |

To change the experience, projects or case studies, edit the files in `src/data/`. To add a note, see "Writing field notes" below.

## Requirements

- Node.js 22 (the version CI uses) and npm.
- For deployment: a Cloudflare account and a Resend API key.

## Local development

```bash
npm install
npm run dev
# http://localhost:3000
```

The contact form needs the Pages runtime, so it does not work under `npm run dev`. Use `npm run cloudflare:dev` to test it.

To exercise the production build and Pages runtime locally:

```bash
npm run cloudflare:dev
# http://localhost:8788
```

## Cloudflare deployment

1. Create a Pages project connected to this repository, or use Wrangler.
2. Set the build command to `npm run build` and the output directory to `out`.
3. Add `RESEND_API_KEY` as a secret in the Pages project settings. The recipient and sender defaults live in `wrangler.toml` and can be overridden there.
4. For analytics, create a site in Cloudflare Web Analytics with the manual JavaScript snippet (not automatic setup) and copy its token. The token for humzamalak.dev is in `.env.production` (it is public, not a secret). `next build` reads it, so a redeploy is needed after a change. The beacon loads only after a visitor accepts the cookie banner.
5. Deploy with:

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

## Checks

CI (`.github/workflows/ci.yml`) runs these on each push and pull request. Run them before you open a PR:

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript, app and Cypress
npm test              # Jest unit tests (src/__tests__)
npm run test:scripts  # tests for the chat-draft script
npm run build         # static export to out/
npm run check:links   # internal links in out/
```

A weekly workflow (`.github/workflows/links.yml`) checks the external links.

## Environment variables

| Name | Where it is set | Used for |
| --- | --- | --- |
| `RESEND_API_KEY` | Cloudflare Pages secret | Contact form email |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME` | `wrangler.toml` | Contact form recipient and sender |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | `.env.production` | Cloudflare Web Analytics (after cookie consent) |
| `NEXT_PUBLIC_GA_ID` | optional, build environment | Google Analytics (after cookie consent) |

`env.example` also lists other variables. The code does not use them.

## Writing field notes

1. Copy `content/notes/_template.md` to `content/notes/<slug>.md`. The file name is the URL: `/notes/<slug>/`.
2. Write the note in Markdown. Keep `status: draft` until it is ready.
3. Set `status: published`, open a PR, and merge. The note appears on `/notes/`, on the home page (newest 3), in `/rss.xml` and in the sitemap.
4. On Medium, use **Import a story** with the note's URL, then publish. Medium links back to this site (canonical link).
5. Add `medium: <Medium URL>` to the frontmatter and merge. The note then shows "Also on Medium".

## Turning chats into a note

The `draft` script collects the chats about one topic into `drafts/<slug>/source.md`. Git ignores `drafts/`, so raw chats never leave your machine.

1. Export the chats:
   - **Claude (claude.ai or Desktop):** Settings > Privacy > Export data. Unzip the file from the email. The link expires after 24 hours.
   - **Claude Code:** no export needed. Use the folder `~/.claude/projects/<project>`.
   - **Hermes Agent:** `hermes sessions export --format md --redact --session-id <id>`. The files go to `~/.hermes/session-exports`.
2. Collect the source:
   ```bash
   npm run draft -- --topic "Shipping a static-first portfolio" --keywords "cloudflare,wrangler,static export" \
     ~/Downloads/claude-export ~/.claude/projects/-Users-humzamalak-Documents-Code-humza-portfolio ~/.hermes/session-exports
   ```
   Options: `--since YYYY-MM-DD`, `--slug <slug>`. The script replaces keys, tokens, emails and IP addresses with `[REDACTED:...]`.
3. In Claude Code, in this repo, run `/draft-note <slug>`. It writes `content/notes/<slug>.md` with `status: draft` and lists the claims you must check.
4. Edit the draft. Remove anything private. Then follow "Writing field notes" above to publish.
