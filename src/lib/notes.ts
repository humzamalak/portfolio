import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Articles live in content/notes/<slug>.md. Files that start with "_" (templates) are ignored.
// Only notes with `status: published` are built into the site.
const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type NoteMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  category: string;
  tags: string[];
  status: "draft" | "published";
  medium?: string; // URL of the Medium copy, added after import
  readTime: string;
};

export type Note = NoteMeta & { html: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readNote(file: string): Note {
  const slug = file.replace(/\.md$/, "");
  if (!SLUG.test(slug)) throw new Error(`content/notes/${file}: file name must be lower-case words joined by "-".`);
  const { data, content } = matter(fs.readFileSync(path.join(NOTES_DIR, file), "utf8"));

  const missing = ["title", "excerpt", "date", "status"].filter(key => !data[key]);
  if (missing.length) throw new Error(`content/notes/${file}: missing ${missing.join(", ")} in the frontmatter.`);
  if (data.status !== "draft" && data.status !== "published") throw new Error(`content/notes/${file}: status must be "draft" or "published".`);
  if (data.medium && !/^https:\/\/([a-z0-9-]+\.)?medium\.com\//.test(data.medium)) throw new Error(`content/notes/${file}: medium must be a https://medium.com/ URL.`);

  // gray-matter turns an unquoted YAML date into a Date object.
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`content/notes/${file}: date must be YYYY-MM-DD.`);

  const words = content.trim().split(/\s+/).length;
  return {
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt),
    date,
    category: String(data.category ?? "Field note"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    status: data.status,
    medium: data.medium ? String(data.medium) : undefined,
    readTime: `${Math.max(1, Math.round(words / 220))} min read`,
    html: marked.parse(content, { async: false }),
  };
}

function allNotes(): Note[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter(file => file.endsWith(".md") && !file.startsWith("_"))
    .map(readNote)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Published notes, newest first, without the article body. */
export function getPublishedNotes(): NoteMeta[] {
  return allNotes()
    .filter(note => note.status === "published")
    .map(({ html: _html, ...meta }) => meta); // eslint-disable-line @typescript-eslint/no-unused-vars
}

export function getNote(slug: string): Note | undefined {
  return allNotes().find(note => note.slug === slug && note.status === "published");
}

export function formatNoteDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export const SITE_URL = "https://humzamalak.dev";
