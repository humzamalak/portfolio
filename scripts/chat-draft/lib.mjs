// Turns chat exports into one plain Markdown source file for a note draft.
// Supported inputs:
//   - claude.ai export: conversations.json (Settings > Privacy > Export data, then unzip)
//   - Claude Code sessions: *.jsonl files under ~/.claude/projects/
//   - Hermes Agent: Markdown files from `hermes sessions export --format md`
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

/** @typedef {{ source: string, title: string, date: string, messages: { role: "user" | "assistant", text: string }[] }} Conversation */

const textOf = content => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.filter(part => part && part.type === "text" && typeof part.text === "string").map(part => part.text).join("\n\n");
  return "";
};

/** claude.ai conversations.json: an array of { name, created_at, chat_messages: [{ sender, text, content }] }. */
export function parseClaudeExport(json) {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  if (!Array.isArray(data)) throw new Error("conversations.json: expected a list of conversations.");
  return data.map(conv => ({
    source: "Claude",
    title: String(conv.name || "Untitled chat"),
    date: String(conv.created_at || "").slice(0, 10),
    messages: (conv.chat_messages || [])
      .map(msg => ({ role: msg.sender === "human" ? "user" : "assistant", text: (textOf(msg.content) || msg.text || "").trim() }))
      .filter(msg => msg.text),
  }));
}

/** Claude Code session JSONL: one event per line. Keeps only the text the user typed and the text Claude wrote. */
export function parseClaudeCodeSession(jsonl, name = "Claude Code session") {
  const messages = [];
  let date = "";
  let title = "";
  for (const line of jsonl.split("\n")) {
    if (!line.trim()) continue;
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === "summary" && event.summary && !title) title = String(event.summary);
    if ((event.type !== "user" && event.type !== "assistant") || event.isMeta || event.isSidechain) continue;
    const text = textOf(event.message?.content).trim();
    // Skip tool results, slash-command wrappers and other system text.
    if (!text || text.startsWith("<command-") || text.startsWith("<local-command") || text.startsWith("Caveat:")) continue;
    if (!date && event.timestamp) date = String(event.timestamp).slice(0, 10);
    messages.push({ role: event.type, text });
  }
  return { source: "Claude Code", title: title || name, date, messages };
}

/** Hermes Agent Markdown export: kept as written, one file per session. */
export function parseHermesMarkdown(markdown, name = "Hermes session") {
  const heading = markdown.match(/^#\s+(.+)$/m);
  const date = markdown.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  return { source: "Hermes", title: heading ? heading[1].trim() : name, date: date ? date[1] : "", messages: [{ role: "assistant", text: markdown.trim() }] };
}

function filesUnder(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap(name => (name.startsWith(".") ? [] : filesUnder(join(path, name))));
}

/** Reads every supported file under the given paths. */
export function loadConversations(paths) {
  const conversations = [];
  for (const path of paths) {
    if (!existsSync(path)) throw new Error(`Not found: ${path}`);
    for (const file of filesUnder(path)) {
      const name = basename(file);
      const ext = extname(file);
      if (name === "conversations.json") conversations.push(...parseClaudeExport(readFileSync(file, "utf8")));
      else if (ext === ".jsonl" && name !== "manifest.jsonl") conversations.push(parseClaudeCodeSession(readFileSync(file, "utf8"), name.replace(ext, "")));
      else if (ext === ".md" || ext === ".qmd") conversations.push(parseHermesMarkdown(readFileSync(file, "utf8"), name.replace(ext, "")));
    }
  }
  return conversations.filter(conv => conv.messages.length > 0);
}

/** Keeps conversations that mention any of the keywords (case-insensitive), on or after `since`. */
export function filterConversations(conversations, { keywords = [], since = "" } = {}) {
  const words = keywords.map(word => word.toLowerCase()).filter(Boolean);
  return conversations.filter(conv => {
    if (since && conv.date && conv.date < since) return false;
    if (!words.length) return true;
    const haystack = `${conv.title}\n${conv.messages.map(msg => msg.text).join("\n")}`.toLowerCase();
    return words.some(word => haystack.includes(word));
  });
}

// Patterns for secrets and personal data. A match is replaced with [REDACTED:<kind>].
const SECRET_PATTERNS = [
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g],
  ["anthropic-key", /\bsk-ant-[A-Za-z0-9_-]{10,}/g],
  ["api-key", /\bsk-[A-Za-z0-9_-]{20,}/g],
  ["aws-key", /\b(AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ["github-token", /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}/g],
  ["slack-token", /\bxox[abposr]-[A-Za-z0-9-]{10,}/g],
  ["resend-key", /\bre_[A-Za-z0-9_]{20,}/g],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g],
  ["secret", /\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*["']?[^\s"']{6,}/gi],
  ["email", /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g],
  ["ip", /\b(?:\d{1,3}\.){3}\d{1,3}\b/g],
];

/** Returns the redacted text and how many matches of each kind were removed. */
export function redact(text) {
  const counts = {};
  let out = text;
  for (const [kind, pattern] of SECRET_PATTERNS) {
    out = out.replace(pattern, () => {
      counts[kind] = (counts[kind] || 0) + 1;
      return `[REDACTED:${kind}]`;
    });
  }
  return { text: out, counts };
}

export function slugify(text) {
  return text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "note";
}

/** One Markdown document with every matching conversation, oldest first. */
export function toSourceMarkdown(conversations, topic) {
  const sorted = [...conversations].sort((a, b) => a.date.localeCompare(b.date));
  const parts = [`# Source chats: ${topic}`, "", `${sorted.length} conversation(s). Secrets and personal data were replaced with [REDACTED:...]. Check again before you publish.`, ""];
  for (const conv of sorted) {
    parts.push(`## ${conv.title}`, "", `_${conv.source}${conv.date ? ` · ${conv.date}` : ""}_`, "");
    for (const msg of conv.messages) parts.push(`**${msg.role === "user" ? "Me" : conv.source}:**`, "", msg.text, "");
  }
  return parts.join("\n");
}
