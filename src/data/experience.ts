export interface ExperienceMetric {
  label: string;
  value: string | number;
  unit?: string;
  improvement?: string;
}

export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
  description: string;
  achievements: string[];
  metrics: ExperienceMetric[];
  techStack: string[];
  highlights: string[];
}

export const experience: ExperienceRole[] = [
  {
    id: "devops-eas-2023-2025",
    company: "Enterprise Architecture Solutions",
    role: "DevOps Engineer",
    startDate: "2023-10",
    endDate: "2025-01",
    current: false,
    location: "Remote, UK",
    description: "Led modernization of a legacy monolith into Kubernetes-based microservices, delivering faster deployments and greater scalability across environments.",
    achievements: [
      "Reduced deployment time by 60% through microservices migration and pipeline optimization",
      "Built Jenkins pipelines integrated with Bitbucket and Kubernetes, cutting manual release steps by 70%",
      "Provisioned multi-region AWS infrastructure with Terraform (EKS, IAM, VPC peering) to improve resilience",
      "Implemented HashiCorp Vault sidecar-based secrets injection eliminating plaintext secrets",
      "Deployed ELK, Prometheus, and Grafana for full observability, reducing incident resolution time by 40%",
      "Designed multi-environment Helm charts for test/staging/prod to reduce environment drift",
      "Integrated MongoDB Atlas with failover-aware connectivity ensuring high availability"
    ],
    metrics: [
      { label: "Deployment Time", value: 60, unit: "%", improvement: "reduction" },
      { label: "Manual Release Steps", value: 70, unit: "%", improvement: "reduction" },
      { label: "Incident Resolution Time", value: 40, unit: "%", improvement: "reduction" }
    ],
    techStack: [
      "AWS",
      "EKS",
      "Terraform",
      "IAM",
      "VPC Peering",
      "Kubernetes",
      "Jenkins",
      "Bitbucket",
      "Helm",
      "HashiCorp Vault",
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "MongoDB Atlas",
      "Docker",
      "Python",
      "Bash"
    ],
    highlights: [
      "Microservices Migration",
      "Multi-Region Resilience",
      "Secrets Management",
      "Observability",
      "Helm Templating",
      "High Availability Data"
    ]
  },
  {
    id: "devops-pa-2021-2023",
    company: "PA Consulting",
    role: "DevOps Engineer",
    startDate: "2021-09",
    endDate: "2023-09",
    current: false,
    location: "Remote, UK",
    description: "Managed AWS services supporting customer-facing apps with 10,000+ concurrent users, maintaining high availability and accelerating delivery.",
    achievements: [
      "Ensured 99.9% uptime across EC2, S3, IAM, and EKS workloads",
      "Refactored Terraform modules and CloudFormation stacks, reducing infra deployment times by 50%",
      "Automated CI/CD with Jenkins, GitLab CI, and GitHub Actions to triple deployment frequency",
      "Diagnosed and resolved server/network/database incidents, cutting MTTR by 35%",
      "Partnered with dev teams to streamline deployments, reducing manual processes by 60%"
    ],
    metrics: [
      { label: "Uptime", value: 99.9, unit: "%" },
      { label: "Infra Deployment Time", value: 50, unit: "%", improvement: "reduction" },
      { label: "Deployment Frequency", value: 3, unit: "x", improvement: "increase" },
      { label: "MTTR", value: 35, unit: "%", improvement: "reduction" }
    ],
    techStack: [
      "AWS",
      "EC2",
      "S3",
      "IAM",
      "EKS",
      "Terraform",
      "CloudFormation",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Kubernetes",
      "Docker",
      "Python",
      "Bash",
      "Git",
      "Bitbucket"
    ],
    highlights: [
      "High Availability",
      "CI/CD Automation",
      "Infrastructure as Code",
      "Incident Response",
      "Cross-Functional Collaboration"
    ]
  },
  {
    id: "devops-penta-2021-03-05",
    company: "Penta Technology",
    role: "DevOps Engineer",
    startDate: "2021-03",
    endDate: "2021-05",
    current: false,
    location: "Remote, UK",
    description: "Provisioned and maintained cloud environments with Terraform and Ansible while automating microservices pipelines to speed releases.",
    achievements: [
      "Ensured development and production parity using Terraform and Ansible",
      "Automated build/test/deploy pipelines for microservices, taking releases from hours to minutes",
      "Managed MinIO object storage within Kubernetes clusters, improving data availability and backups"
    ],
    metrics: [
      { label: "Release Time", value: "minutes", improvement: "from hours" }
    ],
    techStack: [
      "Terraform",
      "Ansible",
      "Kubernetes",
      "MinIO",
      "Docker",
      "Jenkins",
      "Git"
    ],
    highlights: [
      "Environment Parity",
      "Microservices CI/CD",
      "Object Storage Management"
    ]
  },
  {
    id: "junior-devsecops-grabyo-2020-2021",
    company: "Grabyo",
    role: "Junior DevSecOps Engineer",
    startDate: "2020-11",
    endDate: "2021-01",
    current: false,
    location: "Remote, UK",
    description: "Automated secure AWS networking and standardized environment provisioning to improve scalability and onboarding.",
    achievements: [
      "Automated AWS VPC, subnets, and firewall rules using Terraform, reducing setup times by 80%",
      "Containerized services with Docker and deployed to Kubernetes, improving scalability and reducing overhead",
      "Standardized Ansible-based environment setups, cutting configuration errors by 50% and speeding onboarding"
    ],
    metrics: [
      { label: "Environment Setup Time", value: 80, unit: "%", improvement: "reduction" },
      { label: "Configuration Errors", value: 50, unit: "%", improvement: "reduction" }
    ],
    techStack: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "Ansible",
      "Git"
    ],
    highlights: [
      "Network Automation",
      "Containerization",
      "Secure Provisioning"
    ]
  }
];
