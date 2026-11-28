"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { experience } from "@/data/experience";
import { featuredProjects } from "@/data/projects";
import { caseStudyForRepo } from "@/data/case-studies";
import { CONTACT_EMAIL, SiteFooter } from "@/components/site-chrome";
import { Cursor, CountUp, KineticTitle, Rail, Stickers, tilt, untilt, useChaos, useWay, type Stage, type Sticker } from "@/components/play";
import { setSound } from "@/lib/sound";
import styles from "./home.module.css";
import Link from "next/link";
import { Room } from "@/components/room";
import { Terminal } from "@/components/terminal";
import { ProjectCarousel } from "@/components/project-carousel";
import { Notebook, type NotebookEntry } from "@/components/notebook";
import { mediumArticles, MEDIUM_URL } from "@/data/catalog";

type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

function validate(values: Record<Field, string>): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.message.trim()) errors.message = "Please tell me a little about what you are working on.";
  else if (values.message.length > 5000) errors.message = "Please keep the message under 5,000 characters.";
  return errors;
}

const STAGES: Stage[] = [
  { id: "top", label: "Commit" },
  { id: "approach", label: "Build" },
  { id: "work", label: "Test" },
  { id: "machine", label: "Scan" },
  { id: "experience", label: "Deploy" },
  { id: "contact", label: "Live" },
];
const STICKERS: Sticker[] = [
  { text: "it's always DNS", x: 44, y: 5, turn: -8, tone: "hi" },
  { text: "works on my machine", x: 63, y: 15, turn: 6, tone: "pink" },
  { text: "99.9% uptime", x: 30, y: 17, turn: -4, tone: "lime" },
  { text: "kubectl get coffee", x: 80, y: 4, turn: 10, tone: "fg" },
  { text: "rollback first", x: 8, y: 6, turn: -12, tone: "pink" },
  { text: "ship small", x: 86, y: 24, turn: 14, tone: "lime" },
];
const LAYERS = [
  { name: "Foundations", text: "Terraform, AWS accounts, networks and IAM. The parts nobody sees until they are wrong." },
  { name: "Delivery", text: "Pipelines, GitOps and signed images. A release is a small change, not an event." },
  { name: "Runtime", text: "Kubernetes, Vault and autoscaling. Workloads restart themselves before a person must." },
  { name: "Feedback", text: "Prometheus, Grafana and logs. A clear signal, so the alert that fires is the alert that matters." },
];
const TOOLS = Array.from(new Set(experience.flatMap(role => role.techStack))).slice(0, 22);
const WAY_NAMES = { pager: "Pager", nightshift: "Night shift", sorbet: "Sorbet", mono: "Mono" } as const;

const projects = featuredProjects.map(project => ({ name: project.title, type: project.category, description: project.description, tags: project.techStack.slice(0, 4), link: project.link, caseStudy: caseStudyForRepo(project.link)?.slug }));


export type HomeNote = { slug: string; title: string; excerpt: string; category: string; readTime: string; date: string };

export default function HomePage({ notes }: { notes: HomeNote[] }) {
  const router = useRouter();
  // Notebook pages: the notes on this site and the Medium articles, newest first.
  const notebook: NotebookEntry[] = [
    ...notes.map(note => ({ id: `note-${note.slug}`, title: note.title, excerpt: note.excerpt, date: note.date, label: note.category, readTime: note.readTime, href: `/notes/${note.slug}/`, source: "site" as const })),
    ...mediumArticles.map(article => ({ id: article.url, title: article.title, excerpt: article.excerpt, date: article.date, label: article.tags[0] ?? "Article", readTime: article.readTime, href: article.url, source: "medium" as const })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const hasNotebook = notebook.length > 0;
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [contactInView, setContactInView] = useState(false);
  // The plain page is the home page. "/#room" puts the 3D room on top of it.
  const [view, setView] = useState<"room" | "static">("static");
  const [way, nextWay] = useWay();
  const [sound, setSoundOn] = useState(false);
  const chaos = useChaos();

  // The view follows the address, so the browser Back and Forward buttons open and close the room.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      setView(hash === "room" ? "room" : "static");
      if (hash && hash !== "room") window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    };
    const frame = window.requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = view === "room" ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [view]);
  function openRoom() { window.location.hash = "room"; } // adds a history entry, then "hashchange" changes the view
  function leaveRoom(hash?: string) {
    if (hash) { window.location.hash = hash; return; }
    window.history.pushState(null, "", window.location.pathname);
    setView("static");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function toggleSound() { setSoundOn(current => { setSound(!current); return !current; }); }

  // Hide the sticky mobile CTA once the contact section it points to is on screen.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = { name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""), message: String(form.get("message") ?? "") };
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setServerError("");
    if (Object.keys(fieldErrors).length > 0) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", body: JSON.stringify(values), headers: { "Content-Type": "application/json" } });
      if (response.ok) { router.push("/thank-you/"); return; }
      const data = await response.json().catch(() => ({})) as { error?: string };
      setServerError(data.error ?? "The message could not be sent.");
      setStatus("error");
    } catch {
      setServerError("The network request failed.");
      setStatus("error");
    }
  }

  const fieldProps = (name: Field) => ({ name, "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `${name}-error` : undefined, onChange: () => errors[name] && setErrors(current => ({ ...current, [name]: undefined })) });
  const fieldError = (name: Field) => errors[name] && <span className="field-error" id={`${name}-error`}>{errors[name]}</span>;

  return (
    <main className={styles.home} data-phase={chaos.phase}>
      {view === "room" && <Room notes={notes} articles={mediumArticles} onStatic={leaveRoom} />}
      <Cursor />
      <Rail stages={STAGES} />

      <header className={styles.header} data-break="navigation">
        <a className={styles.mark} href="#top">HM<small>Humza Malak</small></a>
        <nav className={styles.links}><a href="#work">Work</a><a href="#experience">Record</a><a href="#contact">Contact</a></nav>
        <div className={styles.tools}>
          <button type="button" onClick={nextWay} data-cursor="recolour" aria-label={`Colour scheme: ${WAY_NAMES[way]}. Change it.`}><i className={styles.swatch} aria-hidden="true" /><span>{WAY_NAMES[way]}</span></button>
          <button type="button" onClick={toggleSound} aria-pressed={sound}>Sound {sound ? "on" : "off"}</button>
          <button type="button" onClick={openRoom}>3D room</button>
          <Link href="/lab/" className={styles.playLink}>▶ On call</Link>
        </div>
      </header>

      <section id="top" className={`${styles.block} ${styles.hero}`}>
        <p className={styles.eyebrow} data-break="status"><i /> Available for platform and DevOps work</p>
        <KineticTitle lines={["Boring deploys.", "Loud website."]} />
        <div className={styles.heroFoot}>
          <p className={styles.lede} data-break="introduction">I&apos;m Humza, a DevOps engineer. I make releases so predictable that nobody talks about them. All the noise went into this page.</p>
          <div className={styles.heroActions} data-break="buttons">
            <button type="button" className={styles.breakButton} onClick={chaos.breakIt} disabled={chaos.phase === "down" || chaos.phase === "healing"} data-cursor="do it">Break this site</button>
            <a className={styles.ghost} href="#work">See the work ↓</a>
          </div>
          <p className={styles.broke}>{chaos.count > 0 ? <>You broke this site <b>{chaos.count}</b> {chaos.count === 1 ? "time" : "times"}. It recovered <b>{chaos.count}</b> {chaos.count === 1 ? "time" : "times"}.</> : <>Go on. It recovers by itself. That is the job.</>}</p>
        </div>
        <Stickers items={STICKERS} />
      </section>

      <div className={styles.tape} aria-hidden="true"><div>{[0, 1].map(copy => <p key={copy}>{TOOLS.map(tool => <span key={tool}>{tool}</span>)}</p>)}</div></div>

      <section id="approach" className={`${styles.block} ${styles.approach}`}>
        <div className={styles.wrap} data-break="principle">
          <p className={styles.kicker}>Operating principle</p>
          <h2>Good infrastructure should feel <em>unremarkable.</em></h2>
          <p className={styles.sub}>When releases are predictable and the signal is clear, teams get their attention back. I design the layers in between.</p>
          <ol className={styles.layers}>{LAYERS.map((layer, index) => <li key={layer.name} tabIndex={0}><span>0{index + 1}</span><h3>{layer.name}</h3><p>{layer.text}</p></li>)}</ol>
        </div>
      </section>

      <section id="work" className={`${styles.block} ${styles.work}`}>
        <div className={styles.wrap}>
          <div className={styles.heading} data-break="work heading"><p className={styles.kicker}>Selected work</p><h2>Built to hold <em>under pressure.</em></h2><p className={styles.sub}>Four systems, one question: how do we make the next change safer?</p></div>
          <div className={styles.cards}>{projects.map((project, index) => (
            <a className={styles.card} key={project.name} data-n={index % 4} data-break={`project ${index + 1}`} data-cursor={project.caseStudy ? "read" : "code"} onPointerMove={tilt} onPointerLeave={untilt} {...(project.caseStudy ? { href: `/work/${project.caseStudy}/`, "aria-label": `${project.name}: case study` } : { href: project.link, target: "_blank", rel: "noopener noreferrer", "aria-label": `${project.name} on GitHub` })}>
              <span className={styles.cardIndex}>0{index + 1}</span>
              <p className={styles.cardType}>{project.type}</p>
              <h3>{project.name}</h3>
              <p className={styles.cardText}>{project.description}</p>
              <div className={styles.tags}>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <span className={styles.cardGo} aria-hidden="true">{project.caseStudy ? "Case study" : "Code"} ↗</span>
            </a>
          ))}</div>
        </div>
      </section>

      <div className={styles.shelf} data-break="repositories"><ProjectCarousel /></div>

      {hasNotebook && <div className={styles.shelf}><Notebook entries={notebook} mediumUrl={MEDIUM_URL || undefined} /></div>}

      <section id="machine" className={`${styles.block} ${styles.machine}`}>
        <div className={`${styles.wrap} ${styles.machineGrid}`}>
          <div data-break="terminal heading"><p className={styles.kicker}>Ask the machine</p><h2>Do not scroll. <em>Type.</em></h2><p className={styles.sub}>This is a real terminal for this site. Try <code>help</code>, <code>ls</code>, <code>search vault</code> or <code>open 1</code>.</p></div>
          <div className={styles.machineScreen} data-break="terminal"><Terminal notes={notes} articles={mediumArticles} /></div>
        </div>
      </section>

      <section id="experience" className={`${styles.block} ${styles.record}`}>
        <div className={styles.wrap}>
          <div className={styles.heading} data-break="record heading"><p className={styles.kicker}>The record</p><h2>Proof in the <em>numbers.</em></h2></div>
          <div className={styles.numbers} data-break="numbers">
            <div><strong><CountUp value={60} />%</strong><p>shorter deployment time</p><small>Enterprise Architecture Solutions · 2023–25</small></div>
            <div><strong><CountUp value={99.9} decimals={1} />%</strong><p>uptime on AWS workloads</p><small>PA Consulting · 2021–23</small></div>
            <div><strong><CountUp value={40} />%</strong><p>faster incident resolution</p><small>Enterprise Architecture Solutions · 2023–25</small></div>
          </div>
          <div className={styles.roles}>{experience.slice(0, 3).map(role => <article key={role.id} data-break={role.company}><p className={styles.when}>{role.startDate.slice(0, 4)} — {role.endDate?.slice(0, 4) ?? "now"}</p><div><h3>{role.role}</h3><p className={styles.where}>{role.company} · {role.location}</p><p>{role.description}</p><div className={styles.tags}>{role.highlights.slice(0, 4).map(item => <span key={item}>{item}</span>)}</div></div></article>)}</div>
        </div>
      </section>

      <section id="contact" className={`${styles.block} ${styles.contact}`}>
        <div className={`${styles.wrap} ${styles.contactGrid}`}>
          <div data-break="contact heading"><p className={styles.kicker}>Page me</p><h2>Have a system that needs <em>calm?</em></h2><p className={styles.sub}>Tell me where the friction is. I&apos;ll reply with a clear next step, not a sales funnel.</p><a className={styles.mail} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} ↗</a></div>
          <form className={styles.form} onSubmit={submitContact} noValidate data-break="contact form"><label>Name<input {...fieldProps("name")} autoComplete="name" required placeholder="Your name" />{fieldError("name")}</label><label>Email<input {...fieldProps("email")} type="email" autoComplete="email" required placeholder="you@company.com" />{fieldError("email")}</label><label>What are you working on?<textarea {...fieldProps("message")} required rows={4} maxLength={5000} placeholder="A migration, a platform, a stubborn incident..." />{fieldError("message")}</label><button disabled={status === "sending"} aria-busy={status === "sending"}>{status === "sending" ? "Sending..." : "Send message ↗"}</button><p className={styles.formMessage} role="alert">{status === "error" && <>{serverError} Please try again, or email me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}</p></form>
        </div>
      </section>

      <div className={styles.sign} aria-hidden="true"><span>Humza Malak</span></div>
      <SiteFooter home />
      <a className="mobile-cta" href="#contact" hidden={contactInView}>Start a conversation <span>↗</span></a>

      {chaos.phase !== "ok" && (
        <aside className={styles.incident} data-phase={chaos.phase} role="status" aria-live="polite">
          <p className={styles.incidentBar}>{chaos.phase === "healed" ? "Resolved · all systems normal" : chaos.phase === "healing" ? "Rollback in progress" : "SEV1 · production is down"}</p>
          <div className={styles.incidentLog}>{chaos.log.slice(-9).map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div>
        </aside>
      )}
    </main>
  );
}
