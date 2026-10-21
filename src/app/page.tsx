"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { experience } from "@/data/experience";
import { CONTACT_EMAIL, SiteFooter, SiteHeader } from "@/components/site-chrome";

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

const projects = [
  { name: "Cloudflare Edge Portfolio", type: "Platform / Web", description: "A static-first personal platform with edge functions for the only dynamic surface: contact.", tags: ["Next.js", "Cloudflare Pages", "Workers"] },
  { name: "Platform Migration Runbook", type: "Infrastructure / Open source", description: "A practical operating model for taking teams from fragile releases to observable, repeatable delivery.", tags: ["Terraform", "Kubernetes", "GitHub Actions"] },
  { name: "Signal Room", type: "Observability / Internal tooling", description: "Decision-focused dashboards that show what changed, who is affected, and what should happen next.", tags: ["Prometheus", "Grafana", "ELK"] },
];

const capabilities = [
  ["01", "Cloud foundations", "AWS, Cloudflare, networking, IAM, and cost-aware runtime design."],
  ["02", "Delivery systems", "CI/CD pipelines that make the safe path the fast path."],
  ["03", "Platform reliability", "Kubernetes, infrastructure as code, observability, and incident response."],
];

const notes = [
  { number: "01", category: "Field note · Platform", title: "The calm platform playbook", description: "The small set of signals, defaults, and rituals that make infrastructure easier to trust.", readTime: "8 min read" },
  { number: "02", category: "Build log · Cloudflare", title: "Shipping a static-first portfolio", description: "What changes when the edge is the default and dynamic behaviour earns its place.", readTime: "6 min read" },
  { number: "03", category: "Systems thinking", title: "Make the safe path the fast path", description: "A practical argument for delivery systems that reduce hesitation instead of adding ceremony.", readTime: "5 min read" },
];

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [contactInView, setContactInView] = useState(false);

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
    <main>
      <SiteHeader home />

      <section id="top" className="hero-shell section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> Available for platform &amp; DevOps work</p>
          <h1>Make the<br /><em>invisible</em> work.</h1>
          <p className="hero-lede">I&apos;m Humza, a DevOps Engineer who turns cloud complexity into calm, observable systems that teams can ship with confidence.</p>
          <div className="hero-actions"><a className="button button-dark" href="#work">See selected work <span>↓</span></a><a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span>↗</span></a></div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit-line orbit-one" /><div className="orbit-line orbit-two" /><div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" /><div className="orbit-core"><span>HM</span><small>systems<br />in motion</small></div></div>
        <div className="hero-meta"><span>01 / 05</span><span>Based in the UK · working globally</span><span className="scroll-cue">Scroll to explore ↓</span></div>
      </section>

      <section id="approach" className="statement section-wrap"><div className="section-label">01 <span>Operating principle</span></div><div><h2>Good infrastructure should feel <strong>unremarkable.</strong></h2><p>When releases are predictable and the signal is clear, teams get their attention back. I design the layers in between: foundations, delivery, runtime, and the feedback loop that keeps them healthy.</p></div></section>

      <section className="capability-band"><div className="section-wrap capability-grid">{capabilities.map(([number, title, description]) => <article key={number}><span className="cap-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section id="work" className="work section-wrap"><div className="section-heading"><div><div className="section-label">02 <span>Selected work</span></div><h2>Built to hold<br /><em>under pressure.</em></h2></div><p>Small set of systems, migrations, and platform patterns built around the same question: how do we make the next change safer?</p></div><div className="project-list">{projects.map((project, index) => <article className="project-row" key={project.name}><span className="project-index">0{index + 1}</span><div><p className="project-type">{project.type}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="project-arrow">↗</span></article>)}</div><a className="text-link work-all" href="/projects/">All projects and repos <span>↗</span></a></section>

      <section id="notes" className="notes-section"><div className="section-wrap"><div className="notes-heading"><div><div className="section-label">03 <span>Field notes</span></div><h2>Ideas worth<br /><em>shipping.</em></h2></div><p>Short, useful notes from the work: platform decisions, build logs, and the patterns I keep coming back to.</p></div><div className="notes-grid">{notes.map(note => <article className="note-card" key={note.number}><div className="note-card-top"><span>{note.number}</span><span>{note.readTime}</span></div><p className="note-category">{note.category}</p><h3>{note.title}</h3><p className="note-description">{note.description}</p><a className="note-link" href="#contact">Read when published <span>↗</span></a></article>)}</div></div></section>

      <section id="experience" className="experience-section"><div className="section-wrap"><div className="section-label">04 <span>Experience</span></div><div className="experience-intro"><h2>Proof in the<br /><em>numbers.</em></h2><p>Across cloud migrations, delivery platforms, and reliability work, I care about measurable movement — not just a longer tool list.</p></div><div className="metric-strip"><div><strong>60<span>%</span></strong><small>faster deployments</small></div><div><strong>99.9<span>%</span></strong><small>service uptime</small></div><div><strong>40<span>%</span></strong><small>faster incident resolution</small></div></div><div className="timeline">{experience.slice(0, 3).map(role => <article key={role.id}><div className="timeline-date">{role.startDate.slice(0, 4)} — {role.endDate?.slice(0, 4) ?? "now"}</div><div><h3>{role.role}</h3><p className="company">{role.company} · {role.location}</p><p>{role.description}</p><div className="tag-list">{role.highlights.slice(0, 4).map(item => <span key={item}>{item}</span>)}</div></div></article>)}</div></div></section>

      <section id="contact" className="contact-section section-wrap"><div className="section-label">05 <span>Let&apos;s talk</span></div><div className="contact-grid"><div><h2>Have a system<br />that needs <em>calm?</em></h2><p>Tell me where the friction is. I&apos;ll reply with a clear next step, not a sales funnel.</p><a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span>↗</span></a></div><form onSubmit={submitContact} noValidate><label>Name<input {...fieldProps("name")} autoComplete="name" required placeholder="Your name" />{fieldError("name")}</label><label>Email<input {...fieldProps("email")} type="email" autoComplete="email" required placeholder="you@company.com" />{fieldError("email")}</label><label>What are you working on?<textarea {...fieldProps("message")} required rows={4} maxLength={5000} placeholder="A migration, a platform, a stubborn incident..." />{fieldError("message")}</label><button className="button button-orange" disabled={status === "sending"} aria-busy={status === "sending"}>{status === "sending" ? "Sending..." : "Send message ↗"}</button><p className="form-message error" role="alert">{status === "error" && <>{serverError} Please try again, or email me at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}</p></form></div></section>

      <SiteFooter home />
      <a className="mobile-cta" href="#contact" hidden={contactInView}>Start a conversation <span>↗</span></a>
    </main>
  );
}
