import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SimplePage } from "@/components/site-chrome";
import { formatNoteDate, getNote, getPublishedNotes } from "@/lib/notes";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// A static export needs at least one path. Until a note is published, a placeholder path
// is built; scripts/postbuild.mjs deletes it from out/ so it is never deployed.
export function generateStaticParams() {
  const notes = getPublishedNotes();
  return notes.length ? notes.map(note => ({ slug: note.slug })) : [{ slug: "none-yet" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return { title: "Not found", robots: { index: false } };
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/notes/${note.slug}/` },
    openGraph: { type: "article", title: note.title, description: note.excerpt, publishedTime: note.date, url: `/notes/${note.slug}/`, images: ["/og-image.jpg"] },
  };
}

export default async function NotePage({ params }: Params) {
  const note = getNote((await params).slug);
  if (!note) notFound();
  return (
    <SimplePage label={`Field note · ${note.category}`} title={note.title}>
      <p className="updated">{formatNoteDate(note.date)} · {note.readTime}{note.medium && <> · <a href={note.medium} target="_blank" rel="noopener">Also on Medium ↗</a></>}</p>
      <article className="note-body" dangerouslySetInnerHTML={{ __html: note.html }} />
      <p className="updated"><Link href="/notes/">← All notes</Link></p>
    </SimplePage>
  );
}
