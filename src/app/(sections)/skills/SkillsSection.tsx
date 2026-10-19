'use client';

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

interface SkillCategory {
  title: string;
  eyebrow: string;
  skills: string[];
  description: string;
  accent: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Cloud Core",
    eyebrow: "AWS / Network / Runtime",
    description: "EKS, IAM, VPC, Lambda, S3, observability and cost controls shaped into production foundations.",
    accent: "from-cyan-300/24 to-blue-500/10",
    skills: ["AWS EKS", "IAM", "VPC", "Lambda", "S3", "Cost controls"],
  },
  {
    title: "Infrastructure Truth",
    eyebrow: "Terraform / Policy / Drift",
    description: "Infrastructure that can be reviewed, rebuilt, promoted, and rolled back without archaeology.",
    accent: "from-emerald-300/24 to-green-500/10",
    skills: ["Terraform", "Ansible", "CloudFormation", "Pulumi", "Policy as code", "Drift detection"],
  },
  {
    title: "Release Systems",
    eyebrow: "CI/CD / Progressive delivery",
    description: "Pipelines that explain failures, enforce quality gates, and preserve human control at risky moments.",
    accent: "from-violet-300/24 to-purple-500/10",
    skills: ["GitHub Actions", "GitLab CI", "Jenkins", "Progressive delivery", "Release automation", "Quality gates"],
  },
  {
    title: "Kubernetes Platforms",
    eyebrow: "Containers / GitOps / Runtime",
    description: "Cluster baselines with deployable patterns, sensible boundaries, and instrumentation from day one.",
    accent: "from-orange-300/24 to-amber-500/10",
    skills: ["Kubernetes", "Docker", "Helm", "Argo CD", "Service mesh", "Container security"],
  },
  {
    title: "Security Posture",
    eyebrow: "DevSecOps / Secrets / Scans",
    description: "Practical controls wired into developer flow: secrets hygiene, policy, SAST/DAST, and image scanning.",
    accent: "from-rose-300/24 to-red-500/10",
    skills: ["Vault", "IAM policy", "SAST/DAST", "Trivy", "Semgrep", "Secrets hygiene"],
  },
  {
    title: "Signal Layer",
    eyebrow: "Metrics / Logs / Incidents",
    description: "Telemetry designed around decisions: what changed, who is affected, what should happen next.",
    accent: "from-teal-300/24 to-cyan-500/10",
    skills: ["Prometheus", "Grafana", "ELK", "CloudWatch", "SLOs", "Incident response"],
  },
];

const SkillsSection = () => {
  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: "easeOut" as const } },
  };

  return (
    <Section id="skills" className="relative overflow-hidden bg-slate-950 py-28 text-white">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),transparent_30%),radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.12),transparent_28rem)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.09 }}
          className="space-y-14"
        >
          <motion.div variants={categoryVariants} className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.34em] text-emerald-200">Stack constellation</p>
              <h2 className="mt-4 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">
                Six modules. One operating system.
              </h2>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 lg:justify-self-end">
              The goal is not a list of tools. It is a connected platform story: cloud foundations,
              infrastructure truth, release safety, runtime control, security posture, and signal clarity.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skillCategories.map((category, index) => (
              <motion.article key={category.title} variants={categoryVariants} className="group h-full">
                <div className={`premium-card relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br ${category.accent} p-6 transition duration-300 hover:-translate-y-1 md:p-7`}>
                  <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl transition group-hover:scale-125" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-black/25 font-mono text-lg font-black text-white shadow-2xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/65">module</span>
                  </div>
                  <p className="relative mt-8 font-mono text-xs uppercase tracking-[0.26em] text-white/55">{category.eyebrow}</p>
                  <h3 className="relative mt-3 text-3xl font-black tracking-[-0.045em] text-white">{category.title}</h3>
                  <p className="relative mt-4 text-sm leading-6 text-slate-300">{category.description}</p>
                  <div className="relative mt-auto flex flex-wrap gap-2 pt-8">
                    {category.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-bold text-white/85">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default SkillsSection;
