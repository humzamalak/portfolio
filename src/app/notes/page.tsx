import type { Metadata } from "next";
import Link from "next/link";
import { SimplePage } from "@/components/site-chrome";
import { formatNoteDate, getPublishedNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Notes from platform and DevOps work: decisions, build logs, and patterns.",
  alternates: { canonical: "/notes/", types: { "application/rss+xml": "/rss.xml" } },
};

export default function NotesPage() {
  const notes = getPublishedNotes();
  return (
    <SimplePage label="Writing · Field notes" title={<>Field <em>notes.</em></>}>
      {notes.length === 0 ? (
        <p>The first notes are in draft. <Link href="/#contact">Get in touch</Link> if you want to hear when they are out.</p>
      ) : (
        <ol className="notes-index">
          {notes.map(note => (
            <li key={note.slug}>
              <p className="updated">{formatNoteDate(note.date)} · {note.readTime} · {note.category}</p>
              <h2><Link href={`/notes/${note.slug}/`}>{note.title}</Link></h2>
              <p>{note.excerpt}</p>
            </li>
          ))}
        </ol>
      )}
      <p className="updated"><a href="/rss.xml">RSS feed</a></p>
    </SimplePage>
  );
}
