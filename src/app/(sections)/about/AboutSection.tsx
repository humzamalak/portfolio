'use client';

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

const operatingSystem = [
  {
    code: "01",
    title: "Reliability Architecture",
    body: "Design defaults that make safe deploys the easiest option: health checks, release gates, rollback paths, and SLO-shaped alerts.",
    metric: "Calm releases",
  },
  {
    code: "02",
    title: "Security Without Drag",
    body: "IAM, secrets, dependency posture, container checks, and policy-as-code wired into the delivery path rather than bolted on later.",
    metric: "Guardrails built in",
  },
  {
    code: "03",
    title: "Platform Leverage",
    body: "Infrastructure that survives handoffs, pivots, cost pressure, and traffic spikes because it is observable, reproducible, and documented.",
    metric: "Teams move faster",
  },
];

const timeline = ["Discover", "Codify", "Secure", "Ship", "Observe", "Improve"];

const AboutSection = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: "easeOut" as const } },
  };

  return (
    <Section id="about" className="relative overflow-hidden bg-slate-950 py-28 text-white">
      <div className="section-beam absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.16),transparent_34rem),radial-gradient(circle_at_90%_75%,rgba(168,85,247,0.14),transparent_30rem)]" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={itemVariants}
          className="lg:sticky lg:top-28"
        >
          <p className="font-mono text-sm uppercase tracking-[0.34em] text-cyan-200">Operating philosophy</p>
          <h2 className="mt-4 text-balance text-5xl font-black leading-[0.9] tracking-[-0.07em] text-white md:text-7xl">
            Not a résumé. A reliability doctrine.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            I think like an operator: every system needs a clear control surface, a safe default path,
            and enough telemetry to make the next decision obvious. That is the energy this site should
            give recruiters in the first ten seconds.
          </p>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-400">delivery loop</p>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">repeatable</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {timeline.map((step, index) => (
                <span key={step} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-200">
                  <span className="mr-2 text-cyan-300">{String(index + 1).padStart(2, "0")}</span>{step}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.12 }}
          className="grid gap-5"
        >
          {operatingSystem.map((principle) => (
            <motion.article key={principle.title} variants={itemVariants} className="premium-card group relative overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 translate-x-14 -translate-y-14 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:scale-125" aria-hidden="true" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200">{principle.code} / doctrine</p>
                  <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">{principle.title}</h3>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{principle.body}</p>
                </div>
                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left md:text-right">
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">outcome</span>
                  <span className="mt-1 block text-sm font-black text-emerald-200">{principle.metric}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutSection;
