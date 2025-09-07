"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";

interface DevOpsProject {
  title: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string[];
  technologies: string[];
  category: string;
  link?: string;
}

const devopsProjects: DevOpsProject[] = [
  {
    title: "Kubernetes Microservices Migration",
    description: "Transformed a monolithic legacy application into a scalable microservices architecture running on Kubernetes.",
    challenge: "Legacy monolith causing deployment bottlenecks and scalability issues with 70% manual release processes.",
    solution: "Designed and implemented Kubernetes-based microservices with Helm charts, automated CI/CD pipelines, and comprehensive monitoring.",
    impact: [
      "60% reduction in deployment time",
      "70% elimination of manual release steps", 
      "99.9% uptime achievement",
      "40% faster incident resolution"
    ],
    technologies: ["Kubernetes", "Helm", "Jenkins", "Terraform", "AWS EKS", "Prometheus", "Grafana"],
    category: "Containerization & Orchestration",
    link: "https://github.com/humzamalak/k8s-microservices"
  },
  {
    title: "Multi-Region AWS Infrastructure",
    description: "Built resilient, multi-region AWS infrastructure with automated failover and disaster recovery capabilities.",
    challenge: "Single-region deployment creating high availability risks and potential data loss scenarios.",
    solution: "Implemented multi-region AWS architecture with VPC peering, automated backups, and cross-region replication using Terraform.",
    impact: [
      "99.9% uptime across regions",
      "RTO reduced to 15 minutes",
      "RPO reduced to 5 minutes",
      "50% cost optimization through reserved instances"
    ],
    technologies: ["AWS", "Terraform", "VPC Peering", "RDS", "S3", "CloudFormation", "Route 53"],
    category: "Cloud Infrastructure",
    link: "https://github.com/humzamalak/aws-multiregion"
  },
  {
    title: "CI/CD Pipeline Automation",
    description: "Implemented comprehensive CI/CD pipelines with automated testing, security scanning, and deployment strategies.",
    challenge: "Manual deployment processes causing inconsistent releases and high error rates in production.",
    solution: "Built Jenkins pipelines with GitLab integration, automated testing, security scanning, and blue-green deployments.",
    impact: [
      "3x increase in deployment frequency",
      "80% reduction in deployment errors",
      "Automated security scanning",
      "Zero-downtime deployments"
    ],
    technologies: ["Jenkins", "GitLab CI", "Docker", "SonarQube", "OWASP ZAP", "Kubernetes", "Helm"],
    category: "CI/CD & Automation",
    link: "https://github.com/humzamalak/cicd-automation"
  },
  {
    title: "Secrets Management & Security",
    description: "Implemented HashiCorp Vault for secure secrets management with automated rotation and access control.",
    challenge: "Plaintext secrets in configuration files creating security vulnerabilities and compliance issues.",
    solution: "Deployed HashiCorp Vault with Kubernetes sidecar injection, automated secret rotation, and RBAC policies.",
    impact: [
      "100% elimination of plaintext secrets",
      "Automated secret rotation",
      "SOC2 compliance achievement",
      "Centralized access control"
    ],
    technologies: ["HashiCorp Vault", "Kubernetes", "RBAC", "AWS IAM", "Terraform", "Prometheus"],
    category: "Security & Compliance",
    link: "https://github.com/humzamalak/vault-security"
  },
  {
    title: "Observability & Monitoring Platform",
    description: "Built comprehensive monitoring solution with ELK stack, Prometheus, and Grafana for full-stack observability.",
    challenge: "Limited visibility into application performance and infrastructure health causing delayed incident response.",
    solution: "Implemented ELK stack for logging, Prometheus for metrics, and Grafana for visualization with automated alerting.",
    impact: [
      "40% reduction in incident resolution time",
      "Proactive issue detection",
      "Real-time performance monitoring",
      "Automated alerting and escalation"
    ],
    technologies: ["ELK Stack", "Prometheus", "Grafana", "Kubernetes", "Fluentd", "Jaeger", "AlertManager"],
    category: "Observability",
    link: "https://github.com/humzamalak/observability-platform"
  },
  {
    title: "Infrastructure as Code Automation",
    description: "Automated infrastructure provisioning and management using Terraform with GitOps workflows.",
    challenge: "Manual infrastructure provisioning causing environment drift and inconsistent deployments.",
    solution: "Implemented Terraform modules with GitOps workflows, automated testing, and environment promotion pipelines.",
    impact: [
      "50% reduction in infrastructure deployment time",
      "Eliminated environment drift",
      "Automated compliance checks",
      "Infrastructure version control"
    ],
    technologies: ["Terraform", "GitOps", "AWS", "GitLab CI", "Terratest", "Terraform Cloud"],
    category: "Infrastructure as Code",
    link: "https://github.com/humzamalak/terraform-automation"
  }
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

                  {/* Challenge & Solution */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Challenge</h4>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Solution</h4>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Key Impact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.impact.map((impact, impactIndex) => (
                        <div key={impactIndex} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></span>
                          <span className="text-sm text-foreground-muted">{impact}</span>
                        </div>
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

          {/* Call to Action */}
          <motion.div variants={projectVariants} className="text-center">
            <div className="bg-background-secondary rounded-xl border border-border p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Ready to Transform Your Infrastructure?
              </h3>
              <p className="text-foreground-muted mb-6 max-w-2xl mx-auto">
                Let&apos;s discuss how I can help you modernize your infrastructure, improve reliability, 
                and accelerate your development workflows with proven DevOps practices.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:bg-primary-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start a Conversation
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}


