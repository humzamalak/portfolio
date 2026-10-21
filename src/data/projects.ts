export interface Project {
  title: string;
  description: string;
  techStack: string[];
  category: string;
  impact: string;
  signal: string;
  link: string;
  // Shown in the homepage "Selected work" list as well as on /projects/
  featured?: boolean;
}

const GITHUB = "https://github.com/humzamalak";

export const projects: Project[] = [
  {
    title: "Production-Ready EKS Cluster with GitOps",
    description: "Kubernetes platform managed through Argo CD, with Vault for secrets and Prometheus and Grafana for observability. Runs on Minikube locally and on AWS EKS provisioned with Terraform.",
    techStack: ["AWS EKS", "Terraform", "Argo CD", "Helm", "Vault", "Prometheus", "Grafana"],
    category: "Cloud Infrastructure",
    impact: "A platform teams can build on",
    signal: "cluster",
    link: `${GITHUB}/Production-Ready-EKS-Cluster-with-GitOps`,
    featured: true,
  },
  {
    title: "DevSecOps CI/CD Pipeline",
    description: "Delivery pipeline for a FastAPI service with static analysis, image and IaC scanning, signed images and build provenance, deploying to Kubernetes on EKS.",
    techStack: ["GitHub Actions", "Semgrep", "Trivy", "Checkov", "Cosign", "Terraform", "Kubernetes"],
    category: "Security & Compliance",
    impact: "Guardrails before production",
    signal: "secure",
    link: `${GITHUB}/DevSecOps-CI-CD-Pipeline-with-Security-Scanning`,
    featured: true,
  },
  {
    title: "DevOps Bash Script Toolkit",
    description: "Tested Bash scripts for semantic version tagging, build and deploy, Terraform runs, Kubernetes and Docker cleanup, health checks, S3 backups and log rotation, linted on Ubuntu, macOS, Alpine and Rocky Linux.",
    techStack: ["Bash", "ShellCheck", "Bats", "Terraform", "kubectl", "Docker", "AWS CLI"],
    category: "Automation Tooling",
    impact: "Sharp tools for repeatable ops",
    signal: "toolkit",
    link: `${GITHUB}/DevOps-Bash-Script-Toolkit`,
    featured: true,
  },
  {
    title: "Cloudflare Edge Portfolio",
    description: "This site: a static-first Next.js export on Cloudflare Pages, with a single Pages Function handling the contact form.",
    techStack: ["Next.js", "TypeScript", "Cloudflare Pages", "Pages Functions", "Jest"],
    category: "Platform / Web",
    impact: "Fast pages, one dynamic surface",
    signal: "edge",
    link: `${GITHUB}/portfolio`,
    featured: true,
  },
  {
    title: "Airsnap",
    description: "Camera-free scroll gestures for macOS. The speakers play an inaudible 19 kHz tone and an FFT pipeline reads the Doppler shift of a moving hand from the microphone.",
    techStack: ["Python", "NumPy", "sounddevice", "macOS Quartz"],
    category: "Experiment",
    impact: "Sound as an input device",
    signal: "doppler",
    link: `${GITHUB}/airsnap`,
  },
  {
    title: "Fully Automated Pipeline",
    description: "Node.js and MongoDB app split into Docker containers, with Jenkins CI and AWS infrastructure provisioned by Terraform for Jenkins and Spinnaker.",
    techStack: ["Jenkins", "Docker Compose", "Terraform", "AWS", "Spinnaker", "Node.js"],
    category: "CI/CD & Automation",
    impact: "From commit to container",
    signal: "pipeline",
    link: `${GITHUB}/FullyAutomatedPipeline`,
  },
  {
    title: "Kubernetes WordPress Cluster",
    description: "WordPress and MariaDB on Kubernetes with persistent volumes, namespaces and NGINX ingress, plus MinIO for object storage.",
    techStack: ["Kubernetes", "WordPress", "MariaDB", "NGINX Ingress", "MinIO"],
    category: "Kubernetes",
    impact: "Stateful apps on Kubernetes",
    signal: "stateful",
    link: `${GITHUB}/K8-Wordpress-Project`,
  },
  {
    title: "Improved CS Rankings",
    description: "University project with a fellow student: a feature for CSRankings that finds which research areas give a university its best rank.",
    techStack: ["Python", "Pandas", "NumPy"],
    category: "Data",
    impact: "Finding the best angle in the data",
    signal: "rankings",
    link: `${GITHUB}/Improved-Rankings`,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
