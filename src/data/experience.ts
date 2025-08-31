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
    id: "senior-devops-engineer",
    company: "TechCorp Solutions",
    role: "Senior DevOps Engineer",
    startDate: "2023-01",
    endDate: "2024-12",
    current: false,
    location: "San Francisco, CA",
    description: "Led infrastructure automation and CI/CD pipeline optimization for a team of 50+ developers.",
    achievements: [
      "Reduced deployment time from 45 minutes to 8 minutes",
      "Implemented infrastructure as code reducing manual provisioning by 80%",
      "Led migration of 200+ services to Kubernetes",
      "Established monitoring and alerting reducing MTTR by 60%"
    ],
    metrics: [
      { label: "Deployment Time", value: "8", unit: "min", improvement: "82% reduction" },
      { label: "Uptime", value: "99.95", unit: "%", improvement: "0.03% improvement" },
      { label: "MTTR", value: "15", unit: "min", improvement: "60% reduction" },
      { label: "Infrastructure Cost", value: "25", unit: "%", improvement: "cost reduction" }
    ],
    techStack: ["AWS", "Kubernetes", "Terraform", "Jenkins", "Prometheus", "Grafana", "Docker", "Python"],
    highlights: ["Team Leadership", "Cost Optimization", "Security Implementation", "Performance Tuning"]
  },
  {
    id: "cloud-architect",
    company: "CloudScale Inc",
    role: "Cloud Architect",
    startDate: "2021-03",
    endDate: "2022-12",
    current: false,
    location: "Austin, TX",
    description: "Designed and implemented multi-cloud solutions for enterprise clients with focus on scalability and cost efficiency.",
    achievements: [
      "Architected solutions for 3 Fortune 500 companies",
      "Reduced cloud costs by 35% through optimization strategies",
      "Implemented disaster recovery with 99.99% RTO/RPO targets",
      "Led security compliance initiatives (SOC2, ISO27001)"
    ],
    metrics: [
      { label: "Cost Reduction", value: "35", unit: "%", improvement: "average across clients" },
      { label: "RTO", value: "15", unit: "min", improvement: "99.99% target achieved" },
      { label: "RPO", value: "5", unit: "min", improvement: "99.99% target achieved" },
      { label: "Client Satisfaction", value: "4.9", unit: "/5", improvement: "based on surveys" }
    ],
    techStack: ["AWS", "Azure", "GCP", "Terraform", "Ansible", "Kubernetes", "Istio", "Vault"],
    highlights: ["Multi-Cloud Strategy", "Cost Optimization", "Security Architecture", "Compliance"]
  },
  {
    id: "devops-engineer",
    company: "StartupFlow",
    role: "DevOps Engineer",
    startDate: "2019-06",
    endDate: "2021-02",
    current: false,
    location: "Remote",
    description: "Built and maintained CI/CD pipelines and infrastructure for a fast-growing startup.",
    achievements: [
      "Built CI/CD pipeline from scratch reducing time-to-market by 70%",
      "Implemented monitoring for 15 microservices",
      "Automated testing and deployment processes",
      "Reduced infrastructure downtime by 90%"
    ],
    metrics: [
      { label: "Time to Market", value: "70", unit: "%", improvement: "reduction" },
      { label: "Deployment Frequency", value: "20", unit: "per day", improvement: "from 2 per day" },
      { label: "Infrastructure Downtime", value: "90", unit: "%", improvement: "reduction" },
      { label: "Test Coverage", value: "85", unit: "%", improvement: "from 40%" }
    ],
    techStack: ["Docker", "GitHub Actions", "AWS", "Terraform", "Prometheus", "Grafana", "Node.js", "PostgreSQL"],
    highlights: ["Pipeline Automation", "Monitoring Setup", "Infrastructure as Code", "Performance Optimization"]
  },
  {
    id: "software-engineer",
    company: "InnovateTech",
    role: "Software Engineer",
    startDate: "2017-08",
    endDate: "2019-05",
    current: false,
    location: "Seattle, WA",
    description: "Full-stack development with focus on backend services and database optimization.",
    achievements: [
      "Developed 5 RESTful APIs serving 100K+ users",
      "Optimized database queries improving response time by 40%",
      "Implemented caching strategy reducing database load by 60%",
      "Contributed to open-source projects with 500+ stars"
    ],
    metrics: [
      { label: "API Response Time", value: "40", unit: "%", improvement: "improvement" },
      { label: "Database Load", value: "60", unit: "%", improvement: "reduction" },
      { label: "Code Coverage", value: "90", unit: "%", improvement: "maintained" },
      { label: "Open Source Stars", value: "500+", unit: "", improvement: "total contributions" }
    ],
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "Jest", "Swagger", "TypeScript"],
    highlights: ["Backend Development", "Database Optimization", "API Design", "Testing"]
  }
];
