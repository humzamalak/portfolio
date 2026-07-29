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

export default function ProjectsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: "easeOut" as const },
    },
  };

  return (
    <Section id="projects" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-14"
        >
          <motion.div variants={projectVariants} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-sm uppercase tracking-[0.32em] text-primary-400">Selected builds</p>
              <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.05em] text-foreground md:text-6xl">Proof, packaged like mission logs.</h2>
              <p className="mt-5 text-lg leading-8 text-foreground-muted">
                Recruiters and collaborators should understand the operational outcome before they click through. Each card leads with impact, then the implementation stack.
              </p>
            </div>
            <a
              href="https://github.com/humzamalak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/70 px-5 py-3 font-bold text-foreground shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-primary-400 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Explore all repos →
            </a>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {devopsProjects.map((project, index) => (
              <motion.article key={project.title} variants={projectVariants} className="group relative">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-border bg-background/75 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-400/60 hover:shadow-[0_28px_100px_rgba(37,99,235,0.18)] md:p-8">
                  <div className="absolute right-0 top-0 h-36 w-36 translate-x-10 -translate-y-10 rounded-full bg-primary-500/10 blur-2xl transition group-hover:scale-125" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-foreground-muted">Log {String(index + 1).padStart(2, "0")} · {project.signal}</p>
                      <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-foreground md:text-3xl">{project.title}</h3>
                    </div>
                    <span className="rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-bold text-primary-300">{project.category}</span>
                  </div>

                  <p className="mt-5 text-lg font-semibold text-foreground">{project.impact}</p>
                  <p className="mt-3 text-base leading-7 text-foreground-muted">{project.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full border border-border bg-background-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground-muted">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <div className="mt-8 border-t border-border/70 pt-5">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center font-bold text-primary-400 transition-colors hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
