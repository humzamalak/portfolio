import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { filterConversations, loadConversations, redact, slugify, toSourceMarkdown } from "./lib.mjs";

const fixtures = fileURLToPath(new URL("./fixtures", import.meta.url));

test("reads all three export formats", () => {
  const convs = loadConversations([fixtures]);
  const bySource = Object.fromEntries(convs.map(c => [c.title, c]));
  assert.equal(bySource["Cloudflare Pages migration"].source, "Claude");
  assert.equal(bySource["Cloudflare Pages migration"].messages.length, 2);
  assert.equal(bySource["Dinner ideas"].messages.length, 1); // falls back to `text` when content is empty
  const session = bySource["Fix wrangler deploy branch"];
  assert.equal(session.source, "Claude Code");
  assert.equal(session.date, "2026-10-01");
  assert.deepEqual(session.messages.map(m => m.role), ["user", "assistant"]); // meta and tool results skipped
  assert.equal(bySource["Kubernetes cost review"].source, "Hermes");
  assert.equal(bySource["Kubernetes cost review"].date, "2026-10-05");
});

test("filters by keyword and date", () => {
  const convs = loadConversations([fixtures]);
  assert.deepEqual(filterConversations(convs, { keywords: ["CLOUDFLARE", "wrangler"] }).map(c => c.title).sort(), ["Cloudflare Pages migration", "Fix wrangler deploy branch"]);
  assert.deepEqual(filterConversations(convs, { keywords: ["wrangler"], since: "2026-10-01" }).map(c => c.title), ["Fix wrangler deploy branch"]);
});

test("redacts secrets and personal data", () => {
  const source = toSourceMarkdown(loadConversations([fixtures]), "test");
  const { text, counts } = redact(source);
  for (const leaked of ["sk-ant-api03", "someone@example.com", "10.0.12.34"]) assert.ok(!text.includes(leaked), leaked);
  assert.equal(counts["anthropic-key"], 1);
  assert.equal(counts.email, 1);
  assert.equal(counts.ip, 1);
  assert.equal(redact("password: hunter2hunter").counts.secret, 1);
  assert.equal(redact("AKIAABCDEFGHIJKLMNOP").counts["aws-key"], 1);
});

test("makes URL-safe slugs", () => {
  assert.equal(slugify("Shipping a static-first portfolio!"), "shipping-a-static-first-portfolio");
  assert.equal(slugify("***"), "note");
});
