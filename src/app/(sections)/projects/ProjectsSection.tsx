"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";

interface DevOpsProject {
  title: string;
  description: string;
  techStack: string[];
  technologies: string[];
  category: string;
  link?: string;
}

const devopsProjects: DevOpsProject[] = [
  {
    title: "Fully Automated Pipeline",
    description: "End-to-end CI/CD pipeline with automated build, test, security scanning, and deploy stages.",
    techStack: ["GitHub Actions", "Docker", "Terraform", "OWASP ZAP", "Snyk"],
    technologies: ["GitHub Actions", "Docker", "Terraform", "OWASP ZAP", "Snyk"],
    category: "CI/CD & Automation",
    link: "https://github.com/humzamalak/FullyAutomatedPipeline",
  },
  {
    title: "DevOps Bash Script Toolkit",
    description: "Reusable Bash utilities for DevOps workflows: provisioning, deployments, logging, backups, and audits.",
    techStack: ["Bash", "Linux", "AWS CLI", "kubectl", "Helm"],
    technologies: ["Bash", "Linux", "AWS CLI", "kubectl", "Helm"],
    category: "Automation Tooling",
    link: "https://github.com/humzamalak/DevOps-Bash-Script-Toolkit",
  },
  {
    title: "DevSecOps CI/CD Pipeline with Security Scanning",
    description: "Security-first pipeline integrating SAST/DAST, dependency and container scanning, and signed releases.",
    techStack: ["GitHub Actions", "Trivy", "Semgrep", "OWASP ZAP", "Cosign"],
    technologies: ["GitHub Actions", "Trivy", "Semgrep", "OWASP ZAP", "Cosign"],
    category: "Security & Compliance",
    link: "https://github.com/humzamalak/DevSecOps-CI-CD-Pipeline-with-Security-Scanning",
  },
  {
    title: "Production-Ready EKS Cluster with GitOps",
    description: "Hardened EKS baseline with Terraform, GitOps (Argo CD), and observability stack for production workloads.",
    techStack: ["AWS EKS", "Terraform", "Argo CD", "Helm", "Prometheus", "Grafana"],
    technologies: ["AWS EKS", "Terraform", "Argo CD", "Helm", "Prometheus", "Grafana"],
    category: "Cloud Infrastructure",
    link: "https://github.com/humzamalak/Production-Ready-EKS-Cluster-with-GitOps",
  },
];

export default function ProjectsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Containerization & Orchestration": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Cloud Infrastructure": "bg-green-500/10 text-green-600 border-green-500/20",
      "CI/CD & Automation": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Security & Compliance": "bg-red-500/10 text-red-600 border-red-500/20",
      "Observability": "bg-teal-500/10 text-teal-600 border-teal-500/20",
      "Infrastructure as Code": "bg-orange-500/10 text-orange-600 border-orange-500/20"
    };
    return colors[category] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
  };

  return (
    <Section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={projectVariants} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              DevOps Projects
            </h2>
            <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
              Real-world DevOps solutions showcasing infrastructure automation, scalability, and reliability improvements.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {devopsProjects.map((project) => (
              <motion.article
                key={project.title}
                variants={projectVariants}
                className="group"
              >
                <div className="bg-background rounded-xl border border-border p-6 h-full transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}>
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-foreground-muted text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack Summary */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-background-secondary text-xs text-foreground-muted rounded-md border border-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-background-secondary text-xs text-foreground-muted rounded-md border border-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {project.link && (
                    <div className="pt-4 border-t border-border">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium transition-colors"
                      >
                        View Implementation
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
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


