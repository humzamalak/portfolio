"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { catalog } from "@/data/catalog";
import { GITHUB_URL } from "@/components/site-chrome";

const formatMonth = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

// All public GitHub repositories as a row of cards. The row is a native horizontal scroller with
// scroll snap, so touch, trackpad, mouse wheel and keyboard all work without a carousel library.
export function ProjectCarousel() {
  const languages = useMemo(() => ["All", ...[...new Set(catalog.map(entry => entry.language))].sort()], []);
  const [language, setLanguage] = useState("All");
  const [position, setPosition] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const shown = language === "All" ? catalog : catalog.filter(entry => entry.language === language);

  // Go back to the first card when the filter changes.
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
  }, [language]);

  // The card nearest the left edge of the row is the current one.
  function onScroll() {
    const row = track.current;
    if (!row) return;
    const cards = [...row.children] as HTMLElement[];
    const nearest = cards.reduce((best, card, index) => (Math.abs(card.offsetLeft - row.offsetLeft - row.scrollLeft) < Math.abs(cards[best].offsetLeft - row.offsetLeft - row.scrollLeft) ? index : best), 0);
    // At the end of the row the last cards cannot reach the left edge, so count the last one as current.
    setPosition(row.scrollLeft + row.clientWidth >= row.scrollWidth - 4 ? cards.length - 1 : nearest);
  }

  function step(direction: 1 | -1) {
    const row = track.current;
    const card = row?.children[0] as HTMLElement | undefined;
    if (!row || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * (card.offsetWidth + 14), behavior: reduced ? "auto" : "smooth" });
  }

  const current = Math.min(position, shown.length - 1);

  return (
    <section id="repos" className="repos-section" aria-labelledby="repos-title">
      <div className="section-wrap">
        <div className="repos-heading">
          <div><div className="section-label">GitHub <span>All public repositories</span></div><h2 id="repos-title">Everything,<br /><em>in the open.</em></h2></div>
          <p>The list comes from GitHub when the site builds. Swipe, scroll, or use the arrow keys. Filter by language.</p>
        </div>
        <div className="repos-controls">
          <div className="repos-filters" role="group" aria-label="Filter repositories by language">
            {languages.map(name => <button type="button" key={name} aria-pressed={language === name} onClick={() => setLanguage(name)}>{name}</button>)}
          </div>
          <div className="repos-nav">
            <span aria-live="polite">{String(current + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => step(-1)} disabled={current === 0} aria-label="Previous repository">←</button>
            <button type="button" onClick={() => step(1)} disabled={current >= shown.length - 1} aria-label="Next repository">→</button>
          </div>
        </div>
      </div>
      <ul className="repos-track" ref={track} onScroll={onScroll} tabIndex={0} aria-label="Repositories. Use the left and right arrow keys to scroll." onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") { event.preventDefault(); step(1); } if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); } }}>
        {shown.map((entry, index) => (
          <li className="repo-card" key={entry.id} data-current={index === current}>
            <div className="repo-card-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{entry.language} · {formatMonth(entry.pushed)}</span></div>
            <h3>{entry.title}</h3>
            <p className="repo-description">{entry.description}</p>
            <div className="tag-list">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <div className="repo-links">
              {entry.caseStudy && <Link href={`/work/${entry.caseStudy}/`} aria-label={`${entry.title}: case study`}>Case study <span>↗</span></Link>}
              <a href={entry.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${entry.title} on GitHub`}>Code <span>↗</span></a>
            </div>
          </li>
        ))}
        <li className="repo-card repo-card-end"><p>That is all of them.</p><a className="text-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub profile <span>↗</span></a></li>
      </ul>
    </section>
  );
}
