"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { play } from "@/lib/sound";
import styles from "@/app/home.module.css";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const calmMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The headline. Each letter gets thin when the pointer comes near it (variable font weight).
export function KineticTitle({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || calmMotion()) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    let frame = 0, x = -9999, y = -9999;
    const paint = () => {
      frame = 0;
      const reach = Math.max(160, window.innerWidth * 0.16);
      for (const letter of letters) {
        const box = letter.getBoundingClientRect();
        const distance = Math.hypot(x - (box.left + box.width / 2), y - (box.top + box.height / 2));
        const near = Math.max(0, 1 - distance / reach);
        letter.style.fontVariationSettings = `"wght" ${Math.round(800 - near * 600)}, "wdth" 75`;
        letter.style.transform = near > 0 ? `translateY(${(-near * 0.06).toFixed(3)}em)` : "";
      }
    };
    const onMove = (event: PointerEvent) => { x = event.clientX; y = event.clientY; if (!frame) frame = requestAnimationFrame(paint); };
    const onLeave = () => { x = -9999; y = -9999; if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(frame); };
  }, []);
  return (
    <h1 ref={ref} className={styles.title} aria-label={lines.join(" ")} data-break="headline">
      {lines.map((line, index) => (
        <span className={styles.titleLine} key={line} aria-hidden="true" data-alt={index % 2 === 1}>
          {line.split(" ").map((word, at) => <span className={styles.titleWord} key={at}>{Array.from(word).map((letter, index) => <span data-letter key={index}>{letter}</span>)}</span>)}
        </span>
      ))}
    </h1>
  );
}

export type Sticker = { text: string; x: number; y: number; turn: number; tone: "hi" | "fg" | "pink" | "lime" };

// Stickers on the hero. The visitor can pick them up and throw them.
export function Stickers({ items }: { items: Sticker[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const top = useRef(1);
  const down = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const sticker = event.currentTarget, area = wrap.current;
    if (!area) return;
    sticker.setPointerCapture(event.pointerId);
    const state = sticker.dataset;
    let x = Number(state.x ?? 0), y = Number(state.y ?? 0), vx = 0, vy = 0, lastX = event.clientX, lastY = event.clientY, lastTime = performance.now();
    top.current += 1; sticker.style.zIndex = String(top.current); sticker.dataset.held = "true";
    const turn = Number(state.turn ?? 0);
    const paint = (lift: number) => { sticker.style.transform = `translate(${x}px, ${y}px) rotate(${turn + vx * 0.4}deg) scale(${lift})`; };
    const move = (moveEvent: PointerEvent) => {
      const now = performance.now(), dt = Math.max(1, now - lastTime);
      vx = ((moveEvent.clientX - lastX) / dt) * 16; vy = ((moveEvent.clientY - lastY) / dt) * 16;
      x += moveEvent.clientX - lastX; y += moveEvent.clientY - lastY; lastX = moveEvent.clientX; lastY = moveEvent.clientY; lastTime = now;
      paint(1.08);
    };
    const up = () => {
      sticker.removeEventListener("pointermove", move); sticker.removeEventListener("pointerup", up); sticker.removeEventListener("pointercancel", up);
      delete sticker.dataset.held; play("drop");
      // Throw: keep the speed, slow down, and bounce off the edges of the hero.
      const glide = () => {
        const bounds = area.getBoundingClientRect(), box = sticker.getBoundingClientRect();
        if (box.left + vx < bounds.left || box.right + vx > bounds.right) vx *= -0.6;
        if (box.top + vy < bounds.top || box.bottom + vy > bounds.bottom) vy *= -0.6;
        x += vx; y += vy; vx *= 0.93; vy *= 0.93; paint(1);
        state.x = String(x); state.y = String(y);
        if (Math.hypot(vx, vy) > 0.3 && !sticker.dataset.held) requestAnimationFrame(glide); else { vx = 0; vy = 0; paint(1); }
      };
      if (calmMotion()) { vx = 0; vy = 0; paint(1); state.x = String(x); state.y = String(y); } else requestAnimationFrame(glide);
    };
    sticker.addEventListener("pointermove", move); sticker.addEventListener("pointerup", up); sticker.addEventListener("pointercancel", up);
  };
  return (
    <div ref={wrap} className={styles.stickers} aria-hidden="true" data-break="stickers">
      {items.map(item => (
        <button type="button" tabIndex={-1} key={item.text} className={styles.sticker} data-tone={item.tone} data-turn={item.turn} data-cursor="drag" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `rotate(${item.turn}deg)` }} onPointerDown={down}>{item.text}</button>
      ))}
    </div>
  );
}

// A ring that follows the pointer and names what a click will do. Mouse only.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ring = ref.current;
    if (!ring || !finePointer() || calmMotion()) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, frame = 0, shown = false;
    const step = () => { x += (tx - x) * 0.22; y += (ty - y) * 0.22; ring.style.transform = `translate(${x}px, ${y}px)`; frame = Math.hypot(tx - x, ty - y) > 0.3 ? requestAnimationFrame(step) : 0; };
    const onMove = (event: PointerEvent) => {
      tx = event.clientX; ty = event.clientY;
      if (!shown) { shown = true; x = tx; y = ty; ring.dataset.on = "true"; }
      const target = (event.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-cursor], a, button");
      const label = target?.dataset.cursor ?? "";
      ring.dataset.mode = target ? (label ? "label" : "link") : "idle";
      if (ring.firstElementChild) ring.firstElementChild.textContent = label;
      if (!frame) frame = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className={styles.cursor} aria-hidden="true"><span /></div>;
}

export type Stage = { id: string; label: string };

// The page is a pipeline. The rail shows which stage the visitor has reached.
export function Rail({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      let current = 0;
      stages.forEach((stage, index) => { const node = document.getElementById(stage.id); if (node && node.getBoundingClientRect().top < window.innerHeight * 0.5) current = index; });
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [stages]);
  return (
    <>
      <div className={styles.progress} aria-hidden="true"><div ref={bar} /></div>
      <nav className={styles.rail} aria-label="Page stages">
        {stages.map((stage, index) => <a key={stage.id} href={`#${stage.id}`} data-state={index < active ? "done" : index === active ? "now" : "next"} aria-current={index === active ? "step" : undefined}><i aria-hidden="true" /><span>{stage.label}</span></a>)}
      </nav>
    </>
  );
}

// A number that counts up when it comes on screen.
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || calmMotion()) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => { const t = Math.min(1, (now - start) / 1400), eased = 1 - Math.pow(1 - t, 3); node.textContent = (value * eased).toFixed(decimals); if (t < 1) frame = requestAnimationFrame(step); };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, decimals]);
  return <span ref={ref}>{value.toFixed(decimals)}</span>;
}

// Cards lean toward the pointer.
export function tilt(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const card = event.currentTarget, box = card.getBoundingClientRect();
  card.style.setProperty("--tilt-x", `${(((event.clientY - box.top) / box.height - 0.5) * -7).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${(((event.clientX - box.left) / box.width - 0.5) * 9).toFixed(2)}deg`);
}
export function untilt(event: ReactPointerEvent<HTMLElement>) { event.currentTarget.style.setProperty("--tilt-x", "0deg"); event.currentTarget.style.setProperty("--tilt-y", "0deg"); }

export const WAYS = ["pager", "nightshift", "sorbet", "mono"] as const;
export type Way = (typeof WAYS)[number];
const WAY_KEY = "hm-way";

// The colour scheme of the site. The visitor can change it; the choice stays for the next visit.
export function useWay(): [Way, () => void] {
  const [way, setWay] = useState<Way>("pager");
  useEffect(() => {
    const frame = requestAnimationFrame(() => { const saved = document.documentElement.dataset.way as Way | undefined; if (saved && WAYS.includes(saved)) setWay(saved); });
    return () => cancelAnimationFrame(frame);
  }, []);
  const next = useCallback(() => setWay(current => {
    const chosen = WAYS[(WAYS.indexOf(current) + 1) % WAYS.length];
    document.documentElement.dataset.way = chosen;
    try { window.localStorage.setItem(WAY_KEY, chosen); } catch { /* storage is blocked */ }
    play("swap");
    return chosen;
  }), []);
  return [way, next];
}

type Phase = "ok" | "down" | "healing" | "healed";
const BROKE_KEY = "hm-broke";

// "Break this site": the page falls apart, then a rollback puts each part back. The count stays in the browser.
export function useChaos() {
  const [phase, setPhase] = useState<Phase>("ok");
  const [log, setLog] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => { try { setCount(Number(window.localStorage.getItem(BROKE_KEY) ?? 0) || 0); } catch { /* storage is blocked */ } });
    const pending = timers.current;
    return () => { cancelAnimationFrame(frame); pending.forEach(id => window.clearTimeout(id)); };
  }, []);
  const breakIt = useCallback(() => {
    if (phase !== "ok" && phase !== "healed") return;
    const parts = Array.from(document.querySelectorAll<HTMLElement>("[data-break]")).filter(part => { const box = part.getBoundingClientRect(); return box.bottom > -200 && box.top < window.innerHeight + 600; });
    const calm = calmMotion();
    const started = performance.now();
    const later = (ms: number, run: () => void) => { timers.current.push(window.setTimeout(run, ms)); };
    setPhase("down"); setLog(["$ kubectl delete everything --force", "SEV1  production is down. You did this."]); play("alarm");
    if (!calm) parts.forEach((part, index) => {
      part.style.transition = `transform ${0.7 + Math.random() * 0.5}s cubic-bezier(.5,0,.9,.4) ${index * 0.04}s, opacity .6s`;
      part.style.transform = `translate(${(Math.random() - 0.5) * 220}px, ${120 + Math.random() * 380}px) rotate(${(Math.random() - 0.5) * 70}deg)`;
      part.style.opacity = "0.85";
    });
    later(1900, () => { setPhase("healing"); setLog(lines => [...lines, "$ git revert HEAD && deploy", "rollback started ..."]); });
    parts.forEach((part, index) => later(2300 + index * 260, () => {
      part.style.transition = "transform .55s cubic-bezier(.2,1.4,.4,1), opacity .3s"; part.style.transform = ""; part.style.opacity = "";
      setLog(lines => [...lines, `✓ ${part.dataset.break} restored`]); play("tick");
    }));
    later(2500 + parts.length * 260, () => {
      parts.forEach(part => { part.style.transition = ""; });
      const seconds = ((performance.now() - started) / 1000).toFixed(1);
      setLog(lines => [...lines, `Recovered in ${seconds} s. Nobody was paged.`]); setPhase("healed"); play("fixed");
      setCount(current => { const total = current + 1; try { window.localStorage.setItem(BROKE_KEY, String(total)); } catch { /* storage is blocked */ } return total; });
    });
    later(6500 + parts.length * 260, () => setPhase(current => (current === "healed" ? "ok" : current)));
  }, [phase]);
  return { phase, log, count, breakIt };
}
