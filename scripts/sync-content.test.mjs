import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMediumFeed, pickRepos } from "./sync-content.mjs";

test("pickRepos keeps only public projects, newest first", () => {
  const base = { private: false, fork: false, archived: false, description: null, language: null, topics: [], stargazers_count: 0, html_url: "https://github.com/u/x" };
  const repos = pickRepos([
    { ...base, name: "old", pushed_at: "2020-01-01T00:00:00Z" },
    { ...base, name: "secret", private: true, pushed_at: "2026-01-01T00:00:00Z" },
    { ...base, name: "a-fork", fork: true, pushed_at: "2026-01-01T00:00:00Z" },
    { ...base, name: "humzamalak", pushed_at: "2026-01-01T00:00:00Z" },
    { ...base, name: "new", pushed_at: "2026-02-01T00:00:00Z" },
  ]);
  assert.deepEqual(repos.map(repo => repo.name), ["new", "old"]);
  assert.equal(repos[0].description, "");
});

test("parseMediumFeed reads title, link, date, tags and a short excerpt", () => {
  const xml = `<rss><channel><title>Feed</title>
    <item><title><![CDATA[Vault & me]]></title><link>https://medium.com/@someone/vault-abc?source=rss</link>
    <category><![CDATA[devops]]></category><pubDate>Mon, 02 Mar 2026 10:00:00 GMT</pubDate>
    <content:encoded><![CDATA[<p>${"word ".repeat(300)}</p>]]></content:encoded></item>
    <item><title>Not Medium</title><link>https://example.com/x</link></item></channel></rss>`;
  const articles = parseMediumFeed(xml);
  assert.equal(articles.length, 1);
  assert.deepEqual({ ...articles[0], excerpt: "" }, { title: "Vault & me", url: "https://medium.com/@someone/vault-abc", date: "2026-03-02", tags: ["devops"], excerpt: "", readTime: "1 min read" });
  assert.ok(articles[0].excerpt.length <= 221 && articles[0].excerpt.endsWith("…"));
});
