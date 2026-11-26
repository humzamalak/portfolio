"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { catalog, type MediumArticle } from "@/data/catalog";
import { caseStudies } from "@/data/case-studies";
import { projects } from "@/data/projects";
import { CONTACT_EMAIL } from "@/components/site-chrome";
import { Terminal } from "@/components/terminal";
import { rackId, type Action, type TerminalNote } from "@/lib/terminal";
import type { RackController } from "@/lib/rack-scene";

const HEAL_MS = 2600;
const servers = catalog.filter(entry => entry.caseStudy);
const formatMonth = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

// The top of the home page: headline and terminal on the left, a 3D server rack on the right.
// The rack is a Three.js scene (src/lib/rack-scene.ts). It loads after the page is interactive.
// Every rack part also has a normal button under the canvas, for keyboards, screen readers,
// and browsers with no WebGL.
export function RackStage({ notes, articles }: { notes: TerminalNote[]; articles: MediumArticle[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<RackController | null>(null);
  const timers = useRef<number[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [down, setDown] = useState<string[]>([]);
  const [stats, setStats] = useState({ off: 0, healed: 0, event: "No events. All units are healthy." });
  const [lights, setLights] = useState(false);

  const focusTerminal = () => document.getElementById("terminal-input")?.focus({ preventScroll: true });

  const select = useCallback((id: string | null) => {
    setSelected(id);
    controller.current?.select(id);
    if (id === "console") focusTerminal();
  }, []);

  // Load three.js and build the scene only in the browser, after the first paint.
  useEffect(() => {
    let disposed = false;
    const timersNow = timers.current;
    import("@/lib/rack-scene").then(({ createRack }) => {
      if (disposed || !canvas.current) return;
      try {
        controller.current = createRack(
          canvas.current,
          { servers: servers.map(entry => ({ id: entry.id, title: entry.title, category: projects.find(project => project.link.toLowerCase() === entry.repoUrl.toLowerCase())?.category ?? entry.language })), tapes: catalog.map(entry => ({ id: entry.id, name: entry.repoUrl.split("/").pop() ?? entry.id, language: entry.language })) },
          { onSelect: id => { setSelected(id); if (id === "console") focusTerminal(); }, onHover: setHover },
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        );
        setState("ready");
      } catch {
        setState("failed"); // no WebGL: the buttons under the canvas still work
      }
    }, () => setState("failed"));
    return () => { disposed = true; timersNow.forEach(clearTimeout); controller.current?.dispose(); controller.current = null; };
  }, []);

  // Switch a server off. Argo CD-style self-heal brings it back after a short time.
  const kill = useCallback((id: string) => {
    const serverId = id.replace(/^server:/, "");
    const entry = servers.find(item => item.id === serverId);
    if (!entry) return;
    setDown(current => {
      if (current.includes(serverId)) return current;
      controller.current?.setDown(serverId, true);
      setStats(stat => ({ ...stat, off: stat.off + 1, event: `You switched off "${entry.title}". Drift found.` }));
      timers.current.push(window.setTimeout(() => {
        controller.current?.setDown(serverId, false);
        setDown(list => list.filter(item => item !== serverId));
        setStats(stat => ({ ...stat, healed: stat.healed + 1, event: `Self-heal done. "${entry.title}" is healthy again.` }));
      }, HEAL_MS));
      return [...current, serverId];
    });
  }, []);

  const toggleLights = useCallback(() => setLights(current => { controller.current?.setLights(!current); return !current; }), []);

  const onRack = useCallback((action: Extract<Action, { type: "rack" }>) => {
    if (action.op === "lights") toggleLights();
    else if (action.op === "kill") { select(action.id); kill(action.id); }
    else select(action.id);
  }, [kill, select, toggleLights]);

  const detail = useMemo(() => {
    if (!selected || selected === "console") return null;
    const entry = catalog.find(item => rackId(item) === selected || `tape:${item.id}` === selected);
    if (!entry) return null;
    return { entry, isServer: selected.startsWith("server:"), study: selected.startsWith("server:") ? caseStudies.find(study => study.slug === entry.caseStudy) : undefined };
  }, [selected]);
  const isDown = detail ? down.includes(detail.entry.id) : false;

  return (
    <section id="top" className="stage" data-lights={lights ? "on" : "off"}>
      <div className="stage-inner section-wrap">
        <div className="stage-copy">
          <p className="eyebrow"><i /> Available for platform &amp; DevOps work</p>
          <h1>Make the<br /><em>invisible</em> work.</h1>
          <p className="hero-lede">I&apos;m Humza, a DevOps Engineer who turns cloud complexity into calm, observable systems that teams can ship with confidence.</p>
          <div className="hero-actions"><a className="button button-orange stage-cta" href="#work">See selected work <span>↓</span></a><a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span>↗</span></a></div>
          <Terminal notes={notes} articles={articles} onRack={onRack} />
        </div>

        <div className="rack-view">
          <canvas ref={canvas} className="rack-canvas" aria-hidden="true" />
          {state === "loading" && <p className="rack-note">Racking the servers ...</p>}
          {state === "failed" && <p className="rack-note">The 3D rack needs WebGL. Use the buttons below.</p>}

          <div className="rack-hud" aria-live="polite">
            <p><span>health</span><b data-bad={down.length > 0}>{down.length > 0 ? `${down.length} degraded` : "all green"}</b></p>
            <p><span>you switched off</span><b>{stats.off}</b></p>
            <p><span>self-healed</span><b>{stats.healed}</b></p>
            <p className="rack-event">{stats.event}</p>
          </div>

          {state === "ready" && !selected && <p className="rack-hint">{hover ?? "Drag to turn the rack. Click a server or a tape."}</p>}

          {detail && (
            <div className="rack-card" role="region" aria-label={`Selected: ${detail.entry.title}`}>
              <p className="rack-card-top"><span data-bad={isDown}>{detail.isServer ? (isDown ? "Down. Self-healing ..." : "Running") : `Tape · ${detail.entry.language}`}</span><span>last push {formatMonth(detail.entry.pushed)}</span></p>
              <h2>{detail.entry.title}</h2>
              <p>{detail.study?.summary ?? detail.entry.description}</p>
              {detail.study && <p className="rack-lesson"><b>What went wrong:</b> {detail.study.lesson.title}</p>}
              <div className="rack-card-actions">
                {detail.study && <Link href={`/work/${detail.study.slug}/`}>Case study <span>↗</span></Link>}
                <a href={detail.entry.repoUrl} target="_blank" rel="noopener noreferrer">Code <span>↗</span></a>
                {detail.isServer && <button type="button" onClick={() => kill(selected!)} disabled={isDown}>{isDown ? "Recovering ..." : "Switch it off"}</button>}
                <button type="button" onClick={() => select(null)}>Push back in</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rack-controls section-wrap">
        <div role="group" aria-label="Rack units">
          {servers.map(entry => <button type="button" key={entry.id} aria-pressed={selected === `server:${entry.id}`} data-bad={down.includes(entry.id)} onClick={() => select(selected === `server:${entry.id}` ? null : `server:${entry.id}`)}><i aria-hidden="true" />{entry.title}</button>)}
        </div>
        <button type="button" className="rack-lights" aria-pressed={lights} onClick={toggleLights}>Room lights: {lights ? "on" : "off"}</button>
      </div>
    </section>
  );
}
