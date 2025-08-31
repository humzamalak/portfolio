export interface Skill {
  name: string;
  icon: string;
  years: number;
  proficiency: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    name: "Cloud",
    skills: [
      { name: "AWS", icon: "aws", years: 5, proficiency: 9 },
      { name: "Kubernetes", icon: "kubernetes", years: 4, proficiency: 8 },
      { name: "Docker", icon: "docker", years: 6, proficiency: 9 },
      { name: "Azure", icon: "azure", years: 3, proficiency: 7 },
      { name: "GCP", icon: "gcp", years: 2, proficiency: 6 }
    ]
  },
  {
    name: "CI/CD",
    skills: [
      { name: "GitHub Actions", icon: "github", years: 4, proficiency: 8 },
      { name: "Jenkins", icon: "jenkins", years: 5, proficiency: 8 },
      { name: "GitLab CI", icon: "gitlab", years: 3, proficiency: 7 },
      { name: "CircleCI", icon: "circleci", years: 2, proficiency: 6 }
    ]
  },
  {
    name: "IaC",
    skills: [
      { name: "Terraform", icon: "terraform", years: 4, proficiency: 8 },
      { name: "Ansible", icon: "ansible", years: 3, proficiency: 7 },
      { name: "CloudFormation", icon: "aws", years: 3, proficiency: 7 },
      { name: "Pulumi", icon: "pulumi", years: 2, proficiency: 6 }
    ]
  },
  {
    name: "Monitoring",
    skills: [
      { name: "Prometheus", icon: "prometheus", years: 4, proficiency: 8 },
      { name: "Grafana", icon: "grafana", years: 4, proficiency: 8 },
      { name: "Datadog", icon: "datadog", years: 3, proficiency: 7 },
      { name: "ELK Stack", icon: "elastic", years: 3, proficiency: 7 }
    ]
  },
  {
    name: "Security",
    skills: [
      { name: "OAuth", icon: "oauth", years: 5, proficiency: 9 },
      { name: "JWT", icon: "jwt", years: 4, proficiency: 8 },
      { name: "SSL/TLS", icon: "ssl", years: 4, proficiency: 8 },
      { name: "Vault", icon: "vault", years: 3, proficiency: 7 }
    ]
  }
];