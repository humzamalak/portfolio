#!/usr/bin/env node
// Usage: npm run draft -- --topic "cloudflare pages" [--keywords "cloudflare,pages,wrangler"] [--since 2026-01-01] <export paths...>
// Writes drafts/<slug>/source.md (git ignores drafts/). Then run /draft-note <slug> in Claude Code to write the note.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { filterConversations, loadConversations, redact, slugify, toSourceMarkdown } from "./lib.mjs";

const MAX_CHARS = 400_000; // about 100k tokens: enough source for one note

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { topic: { type: "string" }, keywords: { type: "string" }, since: { type: "string" }, slug: { type: "string" } },
});

if (!values.topic || positionals.length === 0) {
  console.error('Usage: npm run draft -- --topic "<topic>" [--keywords "a,b,c"] [--since YYYY-MM-DD] [--slug <slug>] <export paths...>');
  console.error("Export paths: an unzipped claude.ai export folder, ~/.claude/projects/<project>, or a Hermes Markdown export folder.");
  process.exit(1);
}

const keywords = (values.keywords ?? values.topic).split(",").map(word => word.trim()).filter(Boolean);
const all = loadConversations(positionals);
const matches = filterConversations(all, { keywords, since: values.since });
if (matches.length === 0) {
  console.error(`Read ${all.length} conversation(s). None mention: ${keywords.join(", ")}. Try other --keywords.`);
  process.exit(1);
}

const { text, counts } = redact(toSourceMarkdown(matches, values.topic));
const slug = values.slug ?? slugify(values.topic);
const dir = join("drafts", slug);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "source.md"), text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}\n\n[TRUNCATED: source was ${text.length} characters]` : text);

console.log(`Read ${all.length} conversation(s). ${matches.length} match: ${keywords.join(", ")}.`);
for (const conv of matches.slice(0, 20)) console.log(`  - ${conv.date || "no date"} · ${conv.source} · ${conv.title}`);
if (matches.length > 20) console.log(`  ... and ${matches.length - 20} more`);
console.log(`Redacted: ${Object.entries(counts).map(([kind, n]) => `${n} ${kind}`).join(", ") || "nothing"}.`);
if (text.length > MAX_CHARS) console.log(`Warning: source cut to ${MAX_CHARS} characters. Use --since or narrower --keywords.`);
console.log(`\nWrote ${dir}/source.md. Next, in Claude Code: /draft-note ${slug}`);
