"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildIndex, complete, run, STATUS, type Action, type Line, type SearchItem, type TerminalNote } from "@/lib/terminal";
import type { MediumArticle } from "@/data/catalog";

type Entry = { id: number; command?: string; lines: Line[] };

// The first screen. It is in the server HTML, so the summary is there before any script runs.
const INTRO: Entry[] = [
  { id: 0, command: "humza status", lines: STATUS },
  { id: 1, lines: [
    { text: "This terminal works. Type a command and press Enter, or click one:", tone: "muted" },
    { text: "help", run: "help" },
    { text: "search kubernetes", run: "search kubernetes" },
    { text: "kill eks", run: "kill eks" },
  ] },
];

// onRack receives the commands that change the 3D rack ("cat", "kill", "lights").
export function Terminal({ notes, articles, onRack }: { notes: TerminalNote[]; articles: MediumArticle[]; onRack?: (action: Extract<Action, { type: "rack" }>) => void }) {
  const router = useRouter();
  const index = useMemo(() => buildIndex(notes, articles), [notes, articles]);
  const [entries, setEntries] = useState<Entry[]>(INTRO);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1); // position in history while the visitor presses arrow up or down
  const lastResults = useRef<SearchItem[]>([]);
  const nextId = useRef(INTRO.length);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Keep the newest output in view. Scroll only the terminal, never the page.
  useEffect(() => {
    if (entries !== INTRO && screen.current) screen.current.scrollTop = screen.current.scrollHeight;
  }, [entries]);

  function go(href: string, external: boolean) {
    if (external) window.open(href, "_blank", "noopener,noreferrer");
    else if (href.startsWith("/#") && window.location.pathname === "/") { const id = href.slice(2); if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`); window.dispatchEvent(new HashChangeEvent("hashchange")); document.getElementById(id)?.scrollIntoView(); }
    else router.push(href);
  }

  function execute(command: string) {
    const text = command.trim();
    const result = run(text, { index, lastResults: lastResults.current, history, notes, articles });
    if (result.results) lastResults.current = result.results;
    if (text) setHistory(current => [...current, text]);
    setCursor(-1);
    setValue("");
    const entry = { id: nextId.current++, command: text, lines: result.lines };
    setEntries(current => (result.action?.type === "clear" ? [] : [...current, entry]));
    if (result.action?.type === "open") go(result.action.href, result.action.external);
    if (result.action?.type === "rack") onRack?.(result.action);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    execute(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab" && value.trim()) {
      const completed = complete(value);
      // Leave Tab alone when there is nothing to complete, so keyboard users can move on.
      if (completed !== value) { event.preventDefault(); setValue(completed); }
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (history.length === 0) return;
      event.preventDefault();
      const next = event.key === "ArrowUp" ? (cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1)) : (cursor === -1 || cursor >= history.length - 1 ? -1 : cursor + 1);
      setCursor(next);
      setValue(next === -1 ? "" : history[next]);
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <aside className="hero-panel terminal" aria-label="Terminal: summary and site search">
      <div className="hero-panel-bar"><i /><i /><i /><span>humza@platform: ~</span></div>
      {/* A click on empty terminal space puts the cursor in the input, as in a real terminal. */}
      <div className="terminal-screen" ref={screen} onClick={event => { if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === "P") input.current?.focus({ preventScroll: true }); }}>
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map(entry => (
            <div className="terminal-entry" key={entry.id}>
              {entry.command !== undefined && <p className="terminal-cmd"><span>$</span> {entry.command}</p>}
              {entry.lines.map((line, lineIndex) => {
                const key = `${entry.id}-${lineIndex}`;
                if (line.run) return <button type="button" className="terminal-chip" key={key} onClick={() => execute(line.run!)} aria-label={`Run the command: ${line.run}`}>{line.text}</button>;
                if (line.href) return <p key={key}><a className="terminal-link" href={line.href} {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={event => { if (!line.external && !event.metaKey && !event.ctrlKey) { event.preventDefault(); go(line.href!, false); } }}>{line.text}</a></p>;
                return <p key={key} className={line.tone ? `terminal-${line.tone}` : undefined}>{line.text}</p>;
              })}
            </div>
          ))}
        </div>
        <form className="terminal-prompt" onSubmit={onSubmit}>
          <label htmlFor="terminal-input"><span aria-hidden="true">$</span><span className="sr-only">Terminal command. Type help to see the commands.</span></label>
          <input id="terminal-input" ref={input} value={value} onChange={event => setValue(event.target.value)} onKeyDown={onKeyDown} placeholder="type help" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={80} enterKeyHint="go" />
        </form>
      </div>
    </aside>
  );
}
