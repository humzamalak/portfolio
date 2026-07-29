'use client';

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

const principles = [
  {
    eyebrow: "01 / Reliability",
    title: "Make the calm path the default",
    body: "I build paved roads: repeatable environments, automated checks, clear rollback paths, and observability that points to the next action instead of another dashboard.",
  },
  {
    eyebrow: "02 / Security",
    title: "Shift left without slowing teams down",
    body: "Secrets, IAM, dependency scanning, container posture, and policy guardrails become part of the delivery system — not a last-minute release tax.",
  },
  {
    eyebrow: "03 / Scale",
    title: "Design for the messy middle",
    body: "The best infrastructure survives product pivots, traffic spikes, migrations, cost pressure, and handoffs between teams who were not in the original meeting.",
  },
];

const operatingLoop = ["Plan", "Provision", "Secure", "Deploy", "Observe", "Improve"];

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.16 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: "easeOut" as const } },
  };

  return (
    <Section id="about" className="relative overflow-hidden py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
        >
          <motion.div variants={itemVariants} className="lg:sticky lg:top-28">
            <p className="font-mono text-sm uppercase tracking-[0.32em] text-primary-400">About / operating philosophy</p>
            <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.05em] text-foreground md:text-6xl">
              Less “portfolio”. More proof of how I think under pressure.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground-muted">
              I’m a DevOps Engineer with 5+ years of experience building secure, scalable, automated cloud infrastructure. My sweet spot is turning legacy release pain into Kubernetes-based platforms, Terraform-managed AWS environments, and CI/CD systems teams can trust.
            </p>

            <div className="mt-8 rounded-[2rem] border border-border bg-background-secondary/50 p-5 shadow-soft backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-foreground-muted">delivery loop</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {operatingLoop.map((step, index) => (
                  <span key={step} className="rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-2 text-sm font-semibold text-primary-200 dark:text-primary-100">
                    {String(index + 1).padStart(2, "0")} · {step}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5">
            {principles.map((principle) => (
              <motion.article
                key={principle.title}
                variants={itemVariants}
                className="group rounded-[2rem] border border-border bg-background/70 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-400/50 hover:shadow-[0_24px_80px_rgba(37,99,235,0.16)] md:p-8"
              >
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-400">{principle.eyebrow}</p>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">{principle.title}</h3>
                <p className="mt-4 text-base leading-7 text-foreground-muted md:text-lg">{principle.body}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutSection;
