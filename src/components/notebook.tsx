"use client";

import { useState } from "react";
import Link from "next/link";

export type NotebookEntry = { id: string; title: string; excerpt: string; date: string; label: string; readTime: string; href: string; source: "site" | "medium" };

const formatDate = (date: string) => (date ? new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "");

// An open notebook. The left page is the contents list; the right page shows one entry.
// Entries are the notes on this site and the articles on Medium, newest first.
export function Notebook({ entries, sectionNumber, mediumUrl }: { entries: NotebookEntry[]; sectionNumber: string; mediumUrl?: string }) {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<"forward" | "back">("forward");
  const entry = entries[page];
  if (!entry) return null;

  function show(next: number) {
    if (next < 0 || next >= entries.length || next === page) return;
    setTurn(next > page ? "forward" : "back");
    setPage(next);
  }

  const link = entry.source === "medium"
    ? <a className="note-link" href={entry.href} target="_blank" rel="noopener noreferrer">Read on Medium <span>↗</span></a>
    : <Link className="note-link" href={entry.href}>Read the note <span>↗</span></Link>;

  return (
    <section id="notes" className="notes-section" aria-labelledby="notebook-title">
      <div className="section-wrap">
        <div className="notes-heading"><div><div className="section-label">{sectionNumber} <span>Notebook</span></div><h2 id="notebook-title">Ideas worth<br /><em>shipping.</em></h2></div><p>Notes from the work: platform decisions, build logs, and the patterns I keep. Pick a page on the left, or turn the pages.</p></div>
        <div className="notebook" onKeyDown={event => { if (event.key === "ArrowRight") show(page + 1); if (event.key === "ArrowLeft") show(page - 1); }}>
          <nav className="notebook-page notebook-contents" aria-label="Notebook contents">
            <p className="notebook-running-head">Contents</p>
            <ol>
              {entries.map((item, index) => (
                <li key={item.id}><button type="button" aria-current={index === page ? "page" : undefined} onClick={() => show(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title}</b><small>{item.source === "medium" ? "Medium" : "This site"}</small></button></li>
              ))}
            </ol>
            {mediumUrl && <a className="note-link" href={mediumUrl} target="_blank" rel="me noopener noreferrer">All articles on Medium <span>↗</span></a>}
          </nav>
          <div className="notebook-spine" aria-hidden="true" />
          {/* The key restarts the page-turn animation each time the entry changes. */}
          <article className="notebook-page notebook-entry" key={entry.id} data-turn={turn} aria-live="polite">
            <p className="notebook-running-head"><span>{entry.label}</span><span>{[formatDate(entry.date), entry.readTime].filter(Boolean).join(" · ")}</span></p>
            <h3>{entry.title}</h3>
            <p className="notebook-excerpt">{entry.excerpt}</p>
            {link}
            <div className="notebook-turn">
              <button type="button" onClick={() => show(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>
              <span>Page {page + 1} of {entries.length}</span>
              <button type="button" onClick={() => show(page + 1)} disabled={page === entries.length - 1} aria-label="Next page">→</button>
            </div>
          </article>
        </div>
        <Link className="text-link work-all" href="/notes/">All notes on this site <span>↗</span></Link>
      </div>
    </section>
  );
}
