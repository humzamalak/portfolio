import { SITE_URL, getPublishedNotes } from "@/lib/notes";

export const dynamic = "force-static";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getPublishedNotes()
    .map(note => `    <item>
      <title>${escape(note.title)}</title>
      <link>${SITE_URL}/notes/${note.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/notes/${note.slug}/</guid>
      <pubDate>${new Date(`${note.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(note.excerpt)}</description>
${note.tags.map(tag => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Humza Malak · Field notes</title>
    <link>${SITE_URL}/notes/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes from platform and DevOps work.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
