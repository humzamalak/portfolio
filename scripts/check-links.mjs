#!/usr/bin/env node
// Checks every internal link in the static build (out/). It fails when a link points to a page,
// file or #anchor that does not exist, or when a link is an empty "#" placeholder.
// External links are checked by the weekly "Links" workflow, because they can fail for reasons outside this repo.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "out");
if (!existsSync(root)) {
  console.error(`No build folder at ${root}. Run "npm run build" first.`);
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) htmlFiles.push(full);
  }
})(root);

const idCache = new Map();
function idsIn(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
  }
  return idCache.get(file);
}

// Map a URL path to the file Cloudflare Pages would serve for it.
function targetFile(urlPath, fromFile) {
  const base = urlPath.startsWith("/") ? join(root, urlPath) : join(dirname(fromFile), urlPath);
  const candidates = urlPath.endsWith("/") ? [join(base, "index.html")] : [base, `${base}.html`, join(base, "index.html")];
  return candidates.find(c => existsSync(c) && statSync(c).isFile());
}

const problems = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const link = raw.replaceAll("&amp;", "&");
    const page = relative(root, file);
    if (link === "#" || link === "") { problems.push(`${page}: empty ${attr}="${raw}"`); continue; }
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(link)) continue;
    const [pathAndQuery, hash] = link.split("#");
    const path = decodeURI(pathAndQuery.split("?")[0]);
    const target = path ? targetFile(path, file) : file;
    if (!target) { problems.push(`${page}: ${attr}="${raw}" points to a missing page or file`); continue; }
    if (hash && target.endsWith(".html") && !idsIn(target).has(decodeURIComponent(hash))) {
      problems.push(`${page}: ${attr}="${raw}" points to a missing #${hash}`);
    }
  }
}

if (problems.length) {
  console.error(`Found ${problems.length} broken internal link(s):\n${problems.map(p => `  - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} pages. All internal links work.`);
