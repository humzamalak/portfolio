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
