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
    description: "Multi-cloud expertise with focus on AWS, GCP, and Azure",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    skills: [
      "AWS (EC2, S3, EKS, IAM, VPC, Lambda)",
      "Google Cloud Platform",
      "Microsoft Azure",
      "Cloud Architecture Design",
      "Multi-region Deployment",
      "Cost Optimization"
    ]
  },
  {
    title: "Infrastructure as Code",
    icon: "🏗️",
    description: "Automated infrastructure provisioning and management",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    skills: [
      "Terraform",
      "AWS CloudFormation",
      "Ansible",
      "Pulumi",
      "Infrastructure Automation",
      "Environment Parity"
    ]
  },
  {
    title: "CI/CD & Automation",
    icon: "🔄",
    description: "Streamlined development workflows and deployment pipelines",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    skills: [
      "Jenkins",
      "GitLab CI/CD",
      "GitHub Actions",
      "Azure DevOps",
      "Pipeline Optimization",
      "Release Automation"
    ]
  },
  {
    title: "Containerization",
    icon: "🐳",
    description: "Container orchestration and microservices architecture",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    skills: [
      "Kubernetes",
      "Docker",
      "Helm Charts",
      "Microservices",
      "Service Mesh",
      "Container Security"
    ]
  },
  {
    title: "Security & Compliance",
    icon: "🔒",
    description: "Secure infrastructure with compliance and governance",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    skills: [
      "HashiCorp Vault",
      "AWS IAM & Policies",
      "Security Scanning",
      "Compliance (SOC2, GDPR)",
      "Secrets Management",
      "Network Security"
    ]
  },
  {
    title: "Observability",
    icon: "📊",
    description: "Comprehensive monitoring, logging, and alerting",
    color: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    skills: [
      "Prometheus & Grafana",
      "ELK Stack (Elasticsearch, Logstash, Kibana)",
      "AWS CloudWatch",
      "Application Performance Monitoring",
      "Alerting & Incident Response",
      "Metrics & Dashboards"
    ]
  }
];

const SkillsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.4, ease: "easeOut" as const } 
    }
  };

  return (
    <Section id="skills" className="py-20 bg-background-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={categoryVariants} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technical Skills
            </h2>
            <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
              Comprehensive DevOps expertise across cloud platforms, automation, and modern infrastructure practices.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={categoryVariants}
                className="group"
              >
                <div className="bg-background rounded-xl border border-border p-6 h-full transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foreground-muted">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        variants={skillVariants}
                        className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 ${category.color}`}
                        style={{ animationDelay: `${skillIndex * 0.05}s` }}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          
        </motion.div>
      </div>
    </Section>
  );
};

export default SkillsSection;
