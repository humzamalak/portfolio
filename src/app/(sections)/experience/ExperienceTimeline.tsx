"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { experience } from "@/data/experience";

interface TimelineItemProps {
  role: typeof experience[0];
  index: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const formatDuration = (start: string, end?: string) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months = Math.max(0, (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()));
  const yearsPart = Math.floor(months / 12);
  const monthsPart = months % 12;
  const yearsText = yearsPart > 0 ? `${yearsPart} ${yearsPart === 1 ? "year" : "years"}` : "";
  const monthsText = monthsPart > 0 ? `${monthsPart} ${monthsPart === 1 ? "month" : "months"}` : "";

  if (yearsText && monthsText) return `${yearsText} ${monthsText}`;
  return yearsText || monthsText || "0 months";
};

const TimelineItem = ({ role, index }: TimelineItemProps) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const primaryMetric = role.metrics[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, delay: index * 0.08, ease: "easeOut" }}
      className="group relative"
    >
      <div className="absolute left-5 top-6 hidden h-[calc(100%+1.25rem)] w-px bg-gradient-to-b from-cyan-300/70 via-white/10 to-transparent lg:block" aria-hidden="true" />
      <div className="premium-card relative overflow-hidden rounded-[2rem] p-5 transition duration-300 group-hover:-translate-y-1 md:p-7 lg:ml-14">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl transition group-hover:scale-125" aria-hidden="true" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_15rem]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-cyan-100">
                phase {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                {formatDate(role.startDate)} — {role.current ? "Present" : formatDate(role.endDate!)} · {formatDuration(role.startDate, role.endDate)}
              </span>
            </div>
            <h3 className="mt-4 text-3xl font-black tracking-[-0.045em] text-white">{role.company}</h3>
            <p className="mt-1 text-lg font-bold text-emerald-200">{role.role}</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{role.description}</p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">primary signal</p>
            <p className="mt-3 text-4xl font-black text-white">
              {primaryMetric?.value}{primaryMetric?.unit}
            </p>
            <p className="mt-1 text-sm font-bold text-cyan-100">{primaryMetric?.label}</p>
            {primaryMetric?.improvement && <p className="mt-1 text-xs text-emerald-200">{primaryMetric.improvement}</p>}
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          {role.techStack.slice(0, isExpanded ? role.techStack.length : 8).map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-bold text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">outcomes</h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {role.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-2xl font-black text-white">{metric.value}{metric.unit}</div>
                    <div className="mt-1 text-xs text-slate-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">proof trail</h4>
              <ul className="mt-3 space-y-2">
                {role.achievements.map((achievement) => (
                  <li key={achievement} className="flex gap-3 rounded-2xl border border-white/10 bg-black/18 px-3 py-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.85)]" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => setIsExpanded((value) => !value)}
          className="relative mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-200/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? "Collapse evidence" : "Expand evidence"}
        </button>
      </div>
    </motion.article>
  );
};

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="relative overflow-hidden bg-slate-950 py-28 text-white" aria-label="Professional Experience Timeline">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(16,185,129,0.13),transparent_30rem),radial-gradient(circle_at_78%_30%,rgba(59,130,246,0.12),transparent_28rem)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.58, ease: "easeOut" }}
            className="lg:sticky lg:top-28"
          >
            <p className="font-mono text-sm uppercase tracking-[0.34em] text-emerald-200">field record</p>
            <h2 className="mt-4 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">Experience as incident memory.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              A career arc through messy production work: migration, automation, release safety, secrets, observability, and the habit of leaving systems easier to operate than they were found.
            </p>
          </motion.div>

          <div className="space-y-5">
            {experience.map((role, index) => (
              <TimelineItem key={role.id} role={role} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
