// Case studies for /work/<slug>/. Every fact here comes from the project's own repository
// (README, docs, workflows, Terraform). "Next" items are planned improvements, not done work.

export type FlowStage = { label: string; items: string[] };

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  repo: string;
  problem: string;
  flow: FlowStage[];
  built: string[];
  decisions: string[];
  lesson: { title: string; body: string };
  next: string[];
  stack: string[];
};

const GITHUB = "https://github.com/humzamalak";

export const caseStudies: CaseStudy[] = [
  {
    slug: "eks-gitops-platform",
    title: "Production-Ready EKS Cluster with GitOps",
    category: "Cloud infrastructure",
    summary: "A Kubernetes platform that runs the same GitOps stack on a laptop (Minikube) and on AWS EKS, with Argo CD, Vault, Prometheus and Grafana.",
    repo: `${GITHUB}/Production-Ready-EKS-Cluster-with-GitOps`,
    problem: "Teams want a production-like Kubernetes platform to learn and test on, but a real EKS cluster costs money and takes about an hour to build. The goal was one Git repository that brings up the same stack locally in about 25 minutes and on AWS when it is needed.",
    flow: [
      { label: "Git", items: ["argo-apps/", "helm-charts/", "terraform/"] },
      { label: "CI (GitHub Actions)", items: ["validate", "terraform plan", "security scan", "daily drift check"] },
      { label: "Argo CD", items: ["App of apps", "automated sync"] },
      { label: "Cluster", items: ["Minikube or EKS (3 AZs)", "Vault", "Prometheus + Grafana", "web app"] },
    ],
    built: [
      "Terraform modules for a VPC across 3 Availability Zones (public and private subnets, one NAT gateway per zone), an EKS cluster with managed node group and add-ons, IAM roles for service accounts (OIDC), KMS keys and VPC flow logs.",
      "Argo CD applications for the web app, Prometheus, Grafana and Vault, so the cluster state comes from Git.",
      "Two Vault modes: single replica with manual unseal on Minikube, and HA with Raft storage and AWS KMS auto-unseal on EKS.",
      "Pod Security Standards, network policies with explicit allow rules, and least-privilege RBAC.",
      "14 GitHub Actions workflows, including Terraform plan and apply, image scanning, secret scanning and a daily drift check at 03:00 UTC.",
    ],
    decisions: [
      "Local first: Minikube is the default path and AWS is an override (values-minikube.yaml first). Most work happens on a laptop, so the docs are about 80% local.",
      "Upstream Helm charts for Prometheus, Grafana and Vault with values files in Git, and a custom chart only for the app.",
      "The Argo CD 3.1 upgrade shipped with a preflight script and a one-command rollback script that backs up Applications and Projects first.",
    ],
    lesson: {
      title: "The Prometheus CRD that was too big",
      body: "Syncing the Prometheus stack failed with \"metadata.annotations: Too long: may not be more than 262144 bytes\". Kubernetes limits annotations to 256 KB, and large inline Helm values in the Argo CD Application pushed the CRD over it. The fix was to move the values into external values files in Git. It is now in the troubleshooting guide.",
    },
    next: [
      "docs/architecture.md still describes an older layout (environments/, applications/). Update it to match argo-apps/ and helm-charts/.",
      "Add the Infracost check that cost_monitoring.tf mentions. The workflows do not run it yet.",
    ],
    stack: ["AWS EKS", "Terraform", "Argo CD", "Helm", "Vault", "Prometheus", "Grafana", "GitHub Actions"],
  },
  {
    slug: "devsecops-pipeline",
    title: "DevSecOps CI/CD Pipeline",
    category: "Security & compliance",
    summary: "A delivery pipeline for a FastAPI service that scans code, dependencies, images and infrastructure, signs the image, and lets only signed images run on EKS.",
    repo: `${GITHUB}/DevSecOps-CI-CD-Pipeline-with-Security-Scanning`,
    problem: "Security reviews done by hand at the end of a release are slow and miss things. The goal was a pipeline where each check runs on every change and the cluster refuses anything that did not pass.",
    flow: [
      { label: "Commit", items: ["flake8, black, isort", "unit tests + coverage"] },
      { label: "Scan", items: ["Semgrep (SAST, SARIF)", "Trivy (Dockerfile + image)", "Checkov (Terraform + K8s)"] },
      { label: "Build", items: ["multi-arch image", "push to ECR", "Cosign keyless signature", "SLSA provenance"] },
      { label: "Deploy (EKS)", items: ["OPA Gatekeeper policies", "rollout + health check", "Prometheus alerts"] },
    ],
    built: [
      "A build workflow: lint, format and import checks, unit tests with coverage, multi-arch Docker build, push to Amazon ECR.",
      "Semgrep SAST with results uploaded as SARIF to GitHub code scanning, and the job fails on findings (--error).",
      "Trivy scans of the Dockerfile and the image, and Checkov scans of the Terraform and Kubernetes files.",
      "Keyless image signing with Cosign and build provenance with actions/attest-build-provenance.",
      "Six OPA Gatekeeper policies: require signed images, block privilege escalation, block hostPath and hostNetwork, require resource limits, block the default service account, and require namespace labels.",
      "External Secrets for secrets, and Prometheus alerts and a Grafana dashboard for Gatekeeper violations.",
    ],
    decisions: [
      "Keyless signing (Cosign with the GitHub OIDC identity), so there is no long-lived signing key to store or rotate.",
      "Enforcement in the cluster as well as in CI: Gatekeeper blocks a workload that skips the pipeline.",
    ],
    lesson: {
      title: "Where the gates are soft",
      body: "A review of the workflows found that Checkov runs with --soft-fail, so a Terraform or Kubernetes misconfiguration is reported but does not stop the build. The PRD targets (for example 95% fewer vulnerabilities in production) are goals, not measured results, so they are not quoted as results here.",
    },
    next: [
      "Make Checkov block on high-severity findings, with a baseline file for accepted risks.",
      "Expand the 70-word README: what each workflow does, the gate order, and how to run it.",
      "Move prd.md and task-list.md into docs/ so the repository root shows the product, not the planning.",
    ],
    stack: ["GitHub Actions", "Semgrep", "Trivy", "Checkov", "Cosign", "OPA Gatekeeper", "Terraform", "AWS EKS"],
  },
  {
    slug: "bash-toolkit",
    title: "DevOps Bash Script Toolkit",
    category: "Automation",
    summary: "Ten tested Bash scripts for the jobs that come back every week: tagging releases, Terraform applies, cleanup, health checks, secrets and backups.",
    repo: `${GITHUB}/DevOps-Bash-Script-Toolkit`,
    problem: "Every team writes the same small scripts again, without tests, and each one fails in its own way. The goal was a set of scripts with one structure, built-in help, a dry-run mode where it matters, and tests that run on several systems.",
    flow: [
      { label: "Script", items: ["set -euo pipefail", "--help from comments", "--dry-run"] },
      { label: "Lint", items: ["ShellCheck"] },
      { label: "Test", items: ["Bats tests", "Ubuntu, macOS, Alpine, CentOS"] },
      { label: "Release", items: ["autotag.sh", "release workflow"] },
    ],
    built: [
      "Scripts in 8 areas: CI/CD (autotag, build and deploy), Terraform apply wrapper, Kubernetes and Docker cleanup, resource and service-health monitoring, .env to Kubernetes secrets, S3 backups and log rotation.",
      "autotag.sh: reads commit messages since the last tag and bumps the semantic version (BREAKING CHANGE, feat:, fix:), with a dry-run mode.",
      "A ShellCheck and test matrix in GitHub Actions on Ubuntu and macOS runners, with Alpine and CentOS as containers.",
      "Bats tests for each script area, a script documentation template, and CONTRIBUTING and SECURITY files.",
    ],
    decisions: [
      "Each script stands alone, so a team can copy one file without the rest.",
      "Help text comes from the script's own header comments, so the docs and the code cannot drift apart.",
    ],
    lesson: {
      title: "A rollback that destroys",
      body: "terraform_apply_wrapper.sh has a --rollback option that runs terraform destroy when an apply fails. On a stack that already exists, that removes working resources too, not only the failed change. Safer options are to stop and keep the state, or to re-apply the last known good commit.",
    },
    next: [
      "Replace the destroy-based rollback with re-applying the previous commit, and require a confirmation flag for destroy.",
      "The README says POSIX-compliant, but the scripts start with #!/usr/bin/env bash and use Bash tests ([[ ]]). Change the claim to Bash.",
      "Each Bats file has one test (12 in total). Add tests for failure paths.",
    ],
    stack: ["Bash", "ShellCheck", "Bats", "GitHub Actions", "Terraform", "Kubernetes", "Docker", "AWS S3"],
  },
  {
    slug: "cloudflare-portfolio",
    title: "Cloudflare Edge Portfolio",
    category: "Web platform",
    summary: "This site: a static Next.js export on Cloudflare Pages, with one Pages Function for the contact form and checks that keep every link live.",
    repo: `${GITHUB}/portfolio`,
    problem: "The old site ran on Vercel with a server it did not need, an old Next.js version with a known vulnerability, and placeholder links. The goal was a fast static site where the only dynamic part is the contact form.",
    flow: [
      { label: "Write", items: ["Markdown notes", "chat-to-draft script"] },
      { label: "CI", items: ["lint + tests", "static build", "internal link check"] },
      { label: "Cloudflare Pages", items: ["static pages + headers", "contact Pages Function"] },
      { label: "Watch", items: ["weekly external link check", "consent-gated analytics"] },
    ],
    built: [
      "Static export (output: export) served by Cloudflare Pages, with security headers and redirects in _headers and _redirects.",
      "One Cloudflare Pages Function for the contact form, which sends mail through the Resend API.",
      "Field notes from Markdown files, an RSS feed, and a script that turns Claude and Hermes chats into a draft note with secrets removed.",
      "A link checker in CI that fails on a missing page, file or #anchor, and a weekly lychee job for external links.",
      "Analytics that load only after consent, and fonts bundled with the site.",
    ],
    decisions: [
      "Static first: a portfolio has no per-user data, so a server adds cost and attack surface for nothing.",
      "Notes are published on this site first and then imported to Medium, which sets a canonical link back here.",
    ],
    lesson: {
      title: "Tests that passed by accident",
      body: "A new node:test file was also picked up by Jest, which failed with \"must contain at least one test\". A local check had only read the summary line, not the exit code, so CI caught it first. The fix was one ignore pattern, and the lesson was to check exit codes.",
    },
    next: [
      "Add a status panel that shows the last deploy, CI result and link-check result, read from GitHub at build time.",
      "Add an architecture diagram and decision records for each case study.",
    ],
    stack: ["Next.js", "Cloudflare Pages", "Pages Functions", "GitHub Actions", "TypeScript"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find(study => study.slug === slug);
}

export function caseStudyForRepo(link: string) {
  return caseStudies.find(study => study.repo === link);
}
