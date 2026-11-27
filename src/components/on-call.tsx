"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogEntry } from "@/data/catalog";
import type { Near, OnCallController } from "@/lib/oncall-scene";
import styles from "./on-call.module.css";

// Sounds are made in code (Web Audio). No audio files.
function makeSound() {
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtor();
  const master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  const hum = ctx.createOscillator(); const humGain = ctx.createGain();
  hum.type = "sawtooth"; hum.frequency.value = 55; humGain.gain.value = 0.025;
  const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 180;
  hum.connect(filter).connect(humGain).connect(master); hum.start();
  const tone = (frequency: number, at: number, length: number, type: OscillatorType = "square", volume = 0.12) => {
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime + at);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + length);
    osc.connect(gain).connect(master); osc.start(ctx.currentTime + at); osc.stop(ctx.currentTime + at + length + 0.05);
  };
  return {
    alarm: () => { tone(880, 0, 0.16); tone(660, 0.2, 0.16); tone(880, 0.4, 0.16); },
    fixed: () => { tone(523, 0, 0.12, "triangle", 0.2); tone(659, 0.1, 0.12, "triangle", 0.2); tone(784, 0.2, 0.25, "triangle", 0.2); },
    setMuted: (muted: boolean) => { master.gain.value = muted ? 0 : 0.5; },
    close: () => { void ctx.close(); },
  };
}

type Phase = "loading" | "ready" | "playing" | "failed";

export function OnCall({ entries }: { entries: CatalogEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controller = useRef<OnCallController | null>(null);
  const sound = useRef<ReturnType<typeof makeSound> | null>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [near, setNear] = useState<Near>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ fixed: 0, open: 0 });
  const [toast, setToast] = useState("");
  const [muted, setMuted] = useState(false);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    let toastTimer = 0;
    const say = (text: string) => { setToast(text); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => setToast(""), 3200); };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("@/lib/oncall-scene")
      .then(module => module.createOnCall(canvasRef.current!, entries.map(entry => ({ id: entry.id, title: entry.title, language: entry.language, pushed: entry.pushed })), {
        onNear: setNear,
        onProgress: setProgress,
        onStats: setStats,
        onIncident: index => { sound.current?.alarm(); say(`Incident: ${entries[index].title} is down`); },
        onFixed: index => { sound.current?.fixed(); say(`${entries[index].title} is back online`); },
      }, reducedMotion))
      .then(made => { if (cancelled) made.dispose(); else { controller.current = made; setPhase("ready"); } })
      .catch(() => { if (!cancelled) setPhase("failed"); });
    return () => { cancelled = true; window.clearTimeout(toastTimer); controller.current?.dispose(); controller.current = null; sound.current?.close(); sound.current = null; };
  }, [entries]);

  const start = useCallback(() => {
    try { sound.current = makeSound(); } catch { sound.current = null; }
    controller.current?.start();
    setPhase("playing");
  }, []);
  const toggleMute = () => { const next = !muted; setMuted(next); sound.current?.setMuted(next); };

  // Touch stick
  const moveStick = (event: React.PointerEvent) => {
    const box = stickRef.current!.getBoundingClientRect();
    const radius = box.width / 2;
    let x = (event.clientX - box.left - radius) / radius, y = (event.clientY - box.top - radius) / radius;
    const length = Math.hypot(x, y); if (length > 1) { x /= length; y /= length; }
    setKnob({ x, y }); controller.current?.setMove(x, y);
  };
  const endStick = () => { setKnob({ x: 0, y: 0 }); controller.current?.setMove(0, 0); };

  const entry = near ? entries[near.index] : null;
  return (
    <main className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="3D data centre. Each rack is one GitHub repository." />

      {phase !== "playing" ? (
        <div className={styles.intro}>
          <p className={styles.kicker}>humzamalak.dev / test page</p>
          <h1>On call</h1>
          <p className={styles.lead}>Each rack is one of my GitHub repositories. You have the pager. Keep the racks online.</p>
          {phase === "failed" ? (
            <>
              <p className={styles.lead}>The 3D scene did not start on this device. Here are the repositories as a list.</p>
              <ul className={styles.list}>{entries.map(item => <li key={item.id}><a href={item.repoUrl} target="_blank" rel="noreferrer">{item.title}</a> <span>{item.language}</span></li>)}</ul>
            </>
          ) : (
            <>
              <ul className={styles.how}>
                <li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or arrow keys, or the touch stick: drive the robot</li>
                <li>Hold <kbd>E</kbd> or <kbd>Space</kbd>, or the Repair button: repair a red rack</li>
                <li>Stop in front of a rack to read about the repository</li>
              </ul>
              <button type="button" className={styles.start} onClick={start} disabled={phase === "loading"}>{phase === "loading" ? "Loading models…" : "Start shift"}</button>
              <p className={styles.small}>The game has sound. You can mute it at the top right.</p>
            </>
          )}
          <Link href="/" className={styles.back}>Back to the site</Link>
        </div>
      ) : (
        <>
          <div className={styles.hud}>
            <span><b>{stats.fixed}</b> repaired</span>
            <span className={stats.open > 0 ? styles.alert : undefined}><b>{stats.open}</b> down</span>
          </div>
          <div className={styles.tools}>
            <button type="button" onClick={toggleMute} aria-pressed={muted}>{muted ? "Sound off" : "Sound on"}</button>
            <Link href="/">Exit</Link>
          </div>
          {toast ? <p className={styles.toast} role="status">{toast}</p> : null}
          {entry ? (
            <aside className={`${styles.card} ${near?.down ? styles.cardDown : ""}`}>
              <p className={styles.kicker}>{near?.down ? "Down" : "Online"} · {entry.language} · last push {entry.pushed}</p>
              <h2>{entry.title}</h2>
              <p>{entry.description}</p>
              {near?.down ? (
                <div className={styles.bar} aria-label="Repair progress"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
              ) : (
                <p className={styles.links}>
                  <a href={entry.repoUrl} target="_blank" rel="noreferrer">Open on GitHub</a>
                  {entry.caseStudy ? <Link href={`/work/${entry.caseStudy}/`}>Read the case study</Link> : null}
                </p>
              )}
            </aside>
          ) : null}
          <div ref={stickRef} className={styles.stick} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); moveStick(event); }} onPointerMove={event => { if (event.buttons || event.pointerType === "touch") moveStick(event); }} onPointerUp={endStick} onPointerCancel={endStick} aria-hidden="true">
            <i style={{ transform: `translate(${knob.x * 34}px, ${knob.y * 34}px)` }} />
          </div>
          {near?.down ? (
            <button type="button" className={styles.repair} onPointerDown={() => controller.current?.setRepair(true)} onPointerUp={() => controller.current?.setRepair(false)} onPointerLeave={() => controller.current?.setRepair(false)} onPointerCancel={() => controller.current?.setRepair(false)} onContextMenu={event => event.preventDefault()}>Hold to repair</button>
          ) : null}
        </>
      )}
    </main>
  );
}
