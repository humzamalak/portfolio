"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

interface DevOpsProject {
  title: string;
  description: string;
  techStack: string[];
  category: string;
  impact: string;
  signal: string;
  link?: string;
}

const devopsProjects: DevOpsProject[] = [
  {
    title: "Fully Automated Pipeline",
    description: "End-to-end CI/CD path with build, test, security scanning, release automation, and deployment handoffs.",
    techStack: ["GitHub Actions", "Docker", "Terraform", "OWASP ZAP", "Snyk"],
    category: "CI/CD & Automation",
    impact: "Release confidence without ritual",
    signal: "pipeline",
    link: "https://github.com/humzamalak/FullyAutomatedPipeline",
  },
  {
    title: "DevOps Bash Script Toolkit",
    description: "Reusable Bash utilities for provisioning, deployments, logging, backups, and operational audits.",
    techStack: ["Bash", "Linux", "AWS CLI", "kubectl", "Helm"],
    category: "Automation Tooling",
    impact: "Sharp tools for repeatable ops",
    signal: "toolkit",
    link: "https://github.com/humzamalak/DevOps-Bash-Script-Toolkit",
  },
  {
    title: "DevSecOps CI/CD Pipeline",
    description: "Security-first delivery integrating SAST/DAST, dependency and container scanning, and signed-release thinking.",
    techStack: ["GitHub Actions", "Trivy", "Semgrep", "OWASP ZAP", "Cosign"],
    category: "Security & Compliance",
    impact: "Guardrails before production",
    signal: "secure",
    link: "https://github.com/humzamalak/DevSecOps-CI-CD-Pipeline-with-Security-Scanning",
  },
  {
    title: "Production-Ready EKS Cluster with GitOps",
    description: "Hardened EKS baseline with Terraform, Argo CD, Helm and observability patterns for production workloads.",
    techStack: ["AWS EKS", "Terraform", "Argo CD", "Helm", "Prometheus", "Grafana"],
    category: "Cloud Infrastructure",
    impact: "A platform teams can build on",
    signal: "cluster",
    link: "https://github.com/humzamalak/Production-Ready-EKS-Cluster-with-GitOps",
  },
];

const proofPoints = [
  "Outcome before implementation",
  "Safety gates before speed",
  "Readable failure modes",
];

export default function ProjectsSection() {
  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: "easeOut" as const } },
  };

  return (
    <Section id="projects" className="relative overflow-hidden bg-slate-950 py-28 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.16),transparent_28rem),radial-gradient(circle_at_82%_45%,rgba(244,114,182,0.12),transparent_28rem)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-14"
        >
          <motion.div variants={projectVariants} className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.34em] text-violet-200">Selected builds</p>
              <h2 className="mt-4 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">
                Mission logs with receipts.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Each project is framed like an operational case file: the pain it removes, the systems it touches,
                and the platform habit it proves.
              </p>
            </div>
            <div className="premium-card rounded-[2rem] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">review lens</p>
              <div className="mt-4 space-y-3">
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                    <span className="text-sm font-bold text-slate-200">{point}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://github.com/humzamalak"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white px-5 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Explore all repos →
              </a>
            </div>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-2">
            {devopsProjects.map((project, index) => (
              <motion.article key={project.title} variants={projectVariants} className="group relative min-h-[25rem]">
                <div className="premium-card relative flex h-full flex-col overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 md:p-8">
                  <div className="absolute right-0 top-0 h-52 w-52 translate-x-16 -translate-y-16 rounded-full bg-cyan-300/10 blur-3xl transition group-hover:scale-125" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                        Log {String(index + 1).padStart(2, "0")} · {project.signal}
                      </p>
                      <h3 className="mt-4 max-w-xl text-3xl font-black tracking-[-0.045em] text-white md:text-4xl">{project.title}</h3>
                    </div>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{project.category}</span>
                  </div>

                  <p className="relative mt-6 text-xl font-black text-emerald-100">{project.impact}</p>
                  <p className="relative mt-3 text-base leading-7 text-slate-300">{project.description}</p>

                  <div className="relative mt-7 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-bold text-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <div className="relative mt-auto border-t border-white/10 pt-6">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-200/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      >
                        Open implementation
                        <span className="ml-2 transition-transform group-hover/link:translate-x-1">→</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
