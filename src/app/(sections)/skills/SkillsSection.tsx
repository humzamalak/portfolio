'use client';

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  description: string;
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Cloud Platforms",
    icon: "☁️",
    description: "AWS-first architecture with pragmatic multi-cloud fluency.",
    color: "from-sky-400/20 to-blue-500/10 text-sky-200 border-sky-400/25",
    skills: ["AWS EKS", "IAM", "VPC", "Lambda", "S3", "Cost controls"],
  },
  {
    title: "Infrastructure as Code",
    icon: "🏗️",
    description: "Versioned infrastructure that can be reviewed, rebuilt, and rolled back.",
    color: "from-emerald-400/20 to-green-500/10 text-emerald-200 border-emerald-400/25",
    skills: ["Terraform", "Ansible", "CloudFormation", "Pulumi", "Policy as code", "Drift detection"],
  },
  {
    title: "CI/CD & Automation",
    icon: "⚡",
    description: "Release paths with fast feedback, security gates, and human-readable failure modes.",
    color: "from-violet-400/20 to-purple-500/10 text-violet-200 border-violet-400/25",
    skills: ["GitHub Actions", "GitLab CI", "Jenkins", "Progressive delivery", "Release automation", "Quality gates"],
  },
  {
    title: "Container Platforms",
    icon: "🚢",
    description: "Production-ready Kubernetes foundations for services that need to move quickly.",
    color: "from-orange-400/20 to-amber-500/10 text-orange-200 border-orange-400/25",
    skills: ["Kubernetes", "Docker", "Helm", "Argo CD", "Service mesh", "Container security"],
  },
  {
    title: "Security & Compliance",
    icon: "🛡️",
    description: "Practical controls that developers can live with and auditors can understand.",
    color: "from-rose-400/20 to-red-500/10 text-rose-200 border-rose-400/25",
    skills: ["Vault", "IAM policy", "SAST/DAST", "Trivy", "Semgrep", "Secrets hygiene"],
  },
  {
    title: "Observability",
    icon: "📡",
    description: "Metrics, logs, traces, and alerts designed around decisions — not noise.",
    color: "from-teal-400/20 to-cyan-500/10 text-teal-200 border-teal-400/25",
    skills: ["Prometheus", "Grafana", "ELK", "CloudWatch", "SLOs", "Incident response"],
  },
];

const SkillsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: "easeOut" as const },
    },
  };

  return (
    <Section id="skills" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.12),transparent_30%)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-14"
        >
          <motion.div variants={categoryVariants} className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-sm uppercase tracking-[0.32em] text-primary-400">Stack / signal over noise</p>
            <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.05em] text-foreground md:text-6xl">A full-stack DevOps control surface.</h2>
            <p className="mt-5 text-lg leading-8 text-foreground-muted">
              The site now frames the skillset like a platform map: cloud, delivery, security, and telemetry connected into one reliable operating system.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category) => (
              <motion.article key={category.title} variants={categoryVariants} className="group h-full">
                <div className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-gradient-to-br ${category.color} p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_90px_rgba(0,0,0,0.22)]`}>
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-2xl shadow-soft">{category.icon}</span>
                    <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/70">module</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.03em] text-white">{category.title}</h3>
                  <p className="mt-3 min-h-14 text-sm leading-6 text-white/75">{category.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/85">
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
