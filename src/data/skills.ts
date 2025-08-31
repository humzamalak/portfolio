// src/data/skills.ts
import { SiAmazon, SiKubernetes, SiDocker, SiHelm, SiJenkins, SiTerraform, SiAnsible, SiGithubactions, SiGitlab, SiPrometheus, SiGrafana, SiElastic, SiVault, SiPython, SiGo } from "react-icons/si";
import { FaLock } from "react-icons/fa";

export type Skill = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  level: number; // 1-10
  years: number;
};

export type SkillsByCategory = {
  category: string;
  skills: Skill[];
};

export const skills: SkillsByCategory[] = [
  {
    category: "Cloud",
    skills: [
      { name: "AWS", icon: SiAmazon, level: 9, years: 5 },
      { name: "Kubernetes", icon: SiKubernetes, level: 9, years: 4 },
      { name: "Docker", icon: SiDocker, level: 9, years: 5 },
      { name: "Helm", icon: SiHelm, level: 8, years: 3 },
    ],
  },
  {
    category: "CI/CD",
    skills: [
      { name: "Jenkins", icon: SiJenkins, level: 9, years: 5 },
      { name: "GitHub Actions", icon: SiGithubactions, level: 8, years: 3 },
      { name: "GitLab CI", icon: SiGitlab, level: 8, years: 3 },
    ],
  },
  {
    category: "Infrastructure as Code",
    skills: [
      { name: "Terraform", icon: SiTerraform, level: 9, years: 4 },
      { name: "Ansible", icon: SiAnsible, level: 8, years: 3 },
      // CloudFormation doesn't have an icon → use AWS icon
      { name: "CloudFormation", icon: SiAmazon, level: 7, years: 3 },
    ],
  },
  {
    category: "Monitoring",
    skills: [
      { name: "Prometheus", icon: SiPrometheus, level: 8, years: 3 },
      { name: "Grafana", icon: SiGrafana, level: 8, years: 3 },
      { name: "ELK Stack", icon: SiElastic, level: 7, years: 2 },
    ],
  },
  {
    category: "Security",
    skills: [
      { name: "HashiCorp Vault", icon: SiVault, level: 8, years: 3 },
      { name: "Compliance & IAM", icon: FaLock, level: 8, years: 4 },
    ],
  },
  {
    category: "Scripting",
    skills: [
      { name: "Python", icon: SiPython, level: 9, years: 5 },
      { name: "Go", icon: SiGo, level: 7, years: 2 },
      { name: "Bash", icon: SiGo, level: 9, years: 5 },
    ],
  },
];