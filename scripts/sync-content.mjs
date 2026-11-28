// Runs before `next build` (npm "prebuild"). Refreshes two data files:
//   src/data/github-repos.json     public repositories, for the project carousel and the terminal
//   src/data/medium-articles.json  Medium articles, for the notebook
// If a request fails (no network, rate limit), the committed file stays as it is and the build continues.
import { readFileSync, writeFileSync } from "node:fs";

const GITHUB_USER = "humzamalak";
// The Medium user name (the part after "@" in the profile URL) is in src/data/medium.json.
// While it is empty, the notebook shows only the notes from this site.
const MEDIUM_USER = JSON.parse(readFileSync("src/data/medium.json", "utf8")).user.replace(/^@/, "");
// Public repositories that are not projects (profile README, policy pages).
const HIDDEN_REPOS = new Set(["humzamalak", "stoneblood-labyrinth-bot-policies"]);

const REPOS_FILE = "src/data/github-repos.json";
const ARTICLES_FILE = "src/data/medium-articles.json";

export function pickRepos(list) {
  return list
    .filter(repo => !repo.private && !repo.fork && !repo.archived && !HIDDEN_REPOS.has(repo.name))
    .map(repo => ({
      name: repo.name,
      description: repo.description ?? "",
      language: repo.language ?? "",
      topics: repo.topics ?? [],
      stars: repo.stargazers_count ?? 0,
      pushed: String(repo.pushed_at ?? "").slice(0, 10),
      url: repo.html_url,
    }))
    .sort((a, b) => b.pushed.localeCompare(a.pushed) || a.name.localeCompare(b.name));
}

const decode = text => text
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ").trim();

export function parseMediumFeed(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const tag = name => item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "";
    const text = decode(tag("content:encoded") || tag("description"));
    const date = new Date(decode(tag("pubDate")));
    return {
      title: decode(tag("title")),
      url: decode(tag("link")).split("?")[0],
      date: Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10),
      tags: [...item.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)].map(match => decode(match[1])),
      excerpt: text.length > 220 ? `${text.slice(0, 220).replace(/\s+\S*$/, "")}…` : text,
      readTime: `${Math.max(1, Math.round(text.split(" ").length / 220))} min read`,
    };
  }).filter(article => article.title && /^https:\/\/([a-z0-9-]+\.)?medium\.com\//.test(article.url));
}

// Write only when the content changed, so a build does not make a needless diff.
function save(file, data) {
  const next = `${JSON.stringify(data, null, 2)}\n`;
  if (readFileSync(file, "utf8") !== next) writeFileSync(file, next);
}

async function get(url, accept) {
  const response = await fetch(url, { headers: { Accept: accept, "User-Agent": "portfolio-build" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response;
}

async function main() {
  try {
    const repos = pickRepos(await (await get(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner`, "application/vnd.github+json")).json());
    if (repos.length === 0) throw new Error("GitHub returned no public repositories");
    save(REPOS_FILE, repos);
    console.log(`sync-content: ${repos.length} GitHub repositories`);
  } catch (error) {
    console.warn(`sync-content: kept the committed ${REPOS_FILE} (${error.message})`);
  }
  if (!MEDIUM_USER) { console.log("sync-content: no user in src/data/medium.json, skipped Medium"); return; }
  try {
    const articles = parseMediumFeed(await (await get(`https://medium.com/feed/@${MEDIUM_USER}`, "application/rss+xml")).text());
    save(ARTICLES_FILE, articles);
    console.log(`sync-content: ${articles.length} Medium articles`);
  } catch (error) {
    console.warn(`sync-content: kept the committed ${ARTICLES_FILE} (${error.message})`);
  }
}

if (process.argv[1]?.endsWith("sync-content.mjs")) await main();
