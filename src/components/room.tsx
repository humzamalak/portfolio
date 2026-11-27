"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { catalog, type MediumArticle } from "@/data/catalog";
import { experience } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { caseStudyForRepo } from "@/data/case-studies";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/components/site-chrome";
import { Terminal } from "@/components/terminal";
import type { Action, TerminalNote } from "@/lib/terminal";
import type { RoomController, SpotId } from "@/lib/room-scene";
import styles from "./room.module.css";

const SPOT_TEXT: Record<SpotId, { chip: string; prompt: string }> = {
  desk: { chip: "Desk", prompt: "Read the portfolio" },
  server: { chip: "Server", prompt: "Open the server" },
  door: { chip: "Door", prompt: "Go on call (game)" },
};
const TABS = ["About", "Work", "Experience", "Terminal", "Contact"] as const;
type Tab = (typeof TABS)[number];
const HEAL_MS = 2600;
const formatMonth = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const work = featuredProjects.map(project => ({ title: project.title, type: project.category, description: project.description, link: project.link, caseStudy: caseStudyForRepo(project.link)?.slug }));

type Phase = "loading" | "ready" | "failed";

// The 3D room that covers the home page. onStatic switches to the plain page under it.
export function Room({ notes, articles, onStatic }: { notes: TerminalNote[]; articles: MediumArticle[]; onStatic: (hash?: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controller = useRef<RoomController | null>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const healTimer = useRef(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [near, setNear] = useState<SpotId | null>(null);
  const [open, setOpen] = useState<SpotId | null>(null);
  const [tab, setTab] = useState<Tab>("About");
  const [unit, setUnit] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [healed, setHealed] = useState(0);
  const [lights, setLights] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const nearRef = useRef<SpotId | null>(null);
  const openRef = useRef<SpotId | null>(null);

  const show = useCallback((spot: SpotId | null) => { openRef.current = spot; setOpen(spot); controller.current?.focus(spot); }, []);

  useEffect(() => {
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("@/lib/room-scene")
      .then(module => module.createRoom(canvasRef.current!, { onNear: spot => { nearRef.current = spot; setNear(spot); }, onArrive: spot => show(spot) }, reducedMotion))
      .then(made => { if (cancelled) made.dispose(); else { controller.current = made; setPhase("ready"); } })
      .catch(() => { if (!cancelled) setPhase("failed"); });
    return () => { cancelled = true; window.clearTimeout(healTimer.current); controller.current?.dispose(); controller.current = null; };
  }, [show]);

  // E or Enter uses the object in reach. Escape closes the panel.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (event.key === "Escape" && openRef.current) { show(null); return; }
      if (["INPUT", "TEXTAREA", "BUTTON", "A"].includes(tag)) return;
      if ((event.key === "e" || event.key === "E" || event.key === "Enter") && nearRef.current && !openRef.current) { event.preventDefault(); show(nearRef.current); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  const pullPlug = useCallback(() => {
    if (down) return;
    setDown(true); controller.current?.setRackDown(true);
    window.clearTimeout(healTimer.current);
    healTimer.current = window.setTimeout(() => { setDown(false); setHealed(count => count + 1); controller.current?.setRackDown(false); }, HEAL_MS);
  }, [down]);
  const toggleLights = useCallback(() => setLights(current => { controller.current?.setLights(!current); return !current; }), []);
  // The terminal commands "kill" and "lights" act on the room.
  const onRack = useCallback((action: Extract<Action, { type: "rack" }>) => { if (action.op === "kill") pullPlug(); if (action.op === "lights") toggleLights(); }, [pullPlug, toggleLights]);

  const moveStick = (event: React.PointerEvent) => {
    const box = stickRef.current!.getBoundingClientRect();
    const radius = box.width / 2;
    let x = (event.clientX - box.left - radius) / radius, y = (event.clientY - box.top - radius) / radius;
    const length = Math.hypot(x, y); if (length > 1) { x /= length; y /= length; }
    setKnob({ x, y }); controller.current?.setMove(x, y);
  };
  const endStick = () => { setKnob({ x: 0, y: 0 }); controller.current?.setMove(0, 0); };

  return (
    <div className={`${styles.room} room-overlay`}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="A 3D office. The desk has the portfolio, the server rack has the projects, the door goes to a game." />

      <header className={styles.top}>
        <p className={styles.name}><b>HM</b><span>Humza Malak · platform engineering</span></p>
        <div className={styles.topActions}>
          <button type="button" onClick={toggleLights} aria-pressed={lights}>Lights: {lights ? "on" : "off"}</button>
          <button type="button" className={styles.staticButton} onClick={() => onStatic()}>Static site</button>
        </div>
      </header>

      {phase === "loading" && <p className={styles.note}>Building the room …</p>}
      {phase === "failed" && <div className={styles.note}><p>The 3D room did not start on this device.</p><button type="button" className={styles.staticButton} onClick={() => onStatic()}>Open the static site</button></div>}

      {phase === "ready" && !open && (
        <footer className={styles.bottom}>
          {near && <button type="button" className={styles.prompt} onClick={() => show(near)}><kbd>E</kbd> {SPOT_TEXT[near].prompt}</button>}
          <nav className={styles.chips} aria-label="Go to">
            <span>Go to</span>
            {(Object.keys(SPOT_TEXT) as SpotId[]).map(id => <button type="button" key={id} onClick={() => controller.current?.goTo(id)}>{SPOT_TEXT[id].chip}</button>)}
          </nav>
          <p className={styles.hint}>Drive the robot with <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the arrow keys. Press <kbd>E</kbd> at the desk, the server or the door.</p>
        </footer>
      )}

      {phase === "ready" && !open && (
        <div ref={stickRef} className={styles.stick} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); moveStick(event); }} onPointerMove={event => { if (event.buttons || event.pointerType === "touch") moveStick(event); }} onPointerUp={endStick} onPointerCancel={endStick} aria-hidden="true">
          <i style={{ transform: `translate(${knob.x * 30}px, ${knob.y * 30}px)` }} />
        </div>
      )}

      {open === "desk" && (
        <section className={styles.panel} aria-label="Desk computer: portfolio">
          <div className={styles.panelBar}><span>desk · portfolio.local</span><button type="button" onClick={() => show(null)}>Stand up <kbd>Esc</kbd></button></div>
          <div className={styles.tabs} role="tablist">{TABS.map(name => <button type="button" role="tab" key={name} aria-selected={tab === name} onClick={() => setTab(name)}>{name}</button>)}</div>
          <div className={styles.panelBody}>
            {tab === "About" && <>
              <h1>Make the <em>invisible</em> work.</h1>
              <p className={styles.lead}>I&apos;m Humza, a DevOps Engineer who turns cloud complexity into calm, observable systems that teams can ship with confidence.</p>
              <p>Good infrastructure should feel unremarkable. When releases are predictable and the signal is clear, teams get their attention back. I design the layers in between: foundations, delivery, runtime, and the feedback loop that keeps them healthy.</p>
              <p className={styles.links}><a href={LINKEDIN_URL} target="_blank" rel="me noopener">LinkedIn ↗</a><a href={GITHUB_URL} target="_blank" rel="me noopener">GitHub ↗</a></p>
            </>}
            {tab === "Work" && <>
              <h2>Selected work</h2>
              <ul className={styles.work}>{work.map(project => <li key={project.title}>
                <small>{project.type}</small><h3>{project.title}</h3><p>{project.description}</p>
                <p className={styles.links}>{project.caseStudy && <Link href={`/work/${project.caseStudy}/`}>Case study ↗</Link>}<a href={project.link} target="_blank" rel="noopener noreferrer">Code ↗</a></p>
              </li>)}</ul>
              <p>The other repositories are in the server rack.</p>
            </>}
            {tab === "Experience" && <>
              <h2>Experience</h2>
              <dl className={styles.metrics}>
                <div><dt>60%</dt><dd>shorter deployment time<small>Enterprise Architecture Solutions · 2023–25</small></dd></div>
                <div><dt>99.9%</dt><dd>uptime on AWS workloads<small>PA Consulting · 2021–23</small></dd></div>
                <div><dt>40%</dt><dd>faster incident resolution<small>Enterprise Architecture Solutions · 2023–25</small></dd></div>
              </dl>
              <ul className={styles.work}>{experience.slice(0, 3).map(role => <li key={role.id}><small>{role.startDate.slice(0, 4)} — {role.endDate?.slice(0, 4) ?? "now"} · {role.company}</small><h3>{role.role}</h3><p>{role.description}</p></li>)}</ul>
            </>}
            {tab === "Terminal" && <Terminal notes={notes} articles={articles} onRack={onRack} />}
            {tab === "Contact" && <>
              <h2>Have a system that needs <em>calm?</em></h2>
              <p>Tell me where the friction is. I&apos;ll reply with a clear next step, not a sales funnel.</p>
              <p className={styles.email}>{CONTACT_EMAIL}</p>
              <p className={styles.links}><a href={`mailto:${CONTACT_EMAIL}`}>Write an email ↗</a><button type="button" onClick={() => onStatic("contact")}>Open the contact form ↗</button></p>
            </>}
          </div>
        </section>
      )}

      {open === "server" && (
        <section className={styles.panel} aria-label="Server rack: repositories">
          <div className={styles.panelBar}><span>rack-01 · {catalog.length} units · <b data-down={down}>{down ? "down, self-healing" : "all green"}</b></span><button type="button" onClick={() => show(null)}>Step back <kbd>Esc</kbd></button></div>
          <div className={styles.panelBody}>
            <p>Each unit is one public GitHub repository. Select a unit to read about it.</p>
            <ul className={styles.units}>{catalog.map(entry => <li key={entry.id} data-open={unit === entry.id}>
              <button type="button" aria-expanded={unit === entry.id} onClick={() => setUnit(unit === entry.id ? null : entry.id)}><i data-down={down} aria-hidden="true" /><span>{entry.title}</span><small>{entry.language} · {formatMonth(entry.pushed)}</small></button>
              {unit === entry.id && <div><p>{entry.description}</p><p className={styles.links}>{entry.caseStudy && <Link href={`/work/${entry.caseStudy}/`}>Case study ↗</Link>}<a href={entry.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a></p></div>}
            </li>)}</ul>
            <div className={styles.ops}>
              <button type="button" onClick={pullPlug} disabled={down}>{down ? "Recovering …" : "Pull the plug"}</button>
              <span>Self-healed: {healed}</span>
              <Link href="/lab/">Go on call (game) ▶</Link>
            </div>
          </div>
        </section>
      )}

      {open === "door" && (
        <section className={`${styles.panel} ${styles.small}`} aria-label="Door: server room">
          <div className={styles.panelBar}><span>door · server room</span><button type="button" onClick={() => show(null)}>Step back <kbd>Esc</kbd></button></div>
          <div className={styles.panelBody}>
            <h2>On call</h2>
            <p>The server room is behind this door. Racks go down. You have the pager. Keep them online.</p>
            <p className={styles.links}><Link className={styles.go} href="/lab/">Start the shift ▶</Link></p>
          </div>
        </section>
      )}
    </div>
  );
}
