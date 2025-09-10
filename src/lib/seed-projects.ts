import { storeProjectWithEmbedding } from './rag';

// Project data from ProjectsSection.tsx
const devopsProjects = [
  {
    title: "Fully Automated Pipeline",
    description: "End-to-end CI/CD pipeline with automated build, test, security scanning, and deploy stages.",
    demo_url: "https://github.com/humzamalak/FullyAutomatedPipeline",
    image_url: null,
  },
  {
    title: "DevOps Bash Script Toolkit",
    description: "Reusable Bash utilities for DevOps workflows: provisioning, deployments, logging, backups, and audits.",
    demo_url: "https://github.com/humzamalak/DevOps-Bash-Script-Toolkit",
    image_url: null,
  },
  {
    title: "DevSecOps CI/CD Pipeline with Security Scanning",
    description: "Security-first pipeline integrating SAST/DAST, dependency and container scanning, and signed releases.",
    demo_url: "https://github.com/humzamalak/DevSecOps-CI-CD-Pipeline-with-Security-Scanning",
    image_url: null,
  },
  {
    title: "Production-Ready EKS Cluster with GitOps",
    description: "Hardened EKS baseline with Terraform, GitOps (Argo CD), and observability stack for production workloads.",
    demo_url: "https://github.com/humzamalak/Production-Ready-EKS-Cluster-with-GitOps",
    image_url: null,
  },
];

// Additional portfolio projects
const portfolioProjects = [
  {
    title: "AI-Powered Portfolio Assistant",
    description: "This intelligent portfolio assistant uses RAG (Retrieval-Augmented Generation) to provide accurate, contextual responses about projects and skills. Built with Next.js, OpenAI, and Supabase.",
    demo_url: "https://humzamalak.dev/assistant",
    image_url: "/og-image.jpg",
  },
  {
    title: "Responsive Portfolio Website",
    description: "Modern, accessible portfolio website built with Next.js, TypeScript, and TailwindCSS. Features dark mode, smooth animations, and mobile-first design.",
    demo_url: "https://humzamalak.dev",
    image_url: "/humza-headshot-optimized.jpg",
  },
];

// Combine all projects
const allProjects = [...devopsProjects, ...portfolioProjects];

// Seed the database with project data
export async function seedProjects(): Promise<void> {
  try {
    console.log('Starting project seeding...');
    
    for (const project of allProjects) {
      try {
        await storeProjectWithEmbedding(project);
        console.log(`✅ Stored project: ${project.title}`);
      } catch (error) {
        console.error(`❌ Failed to store project: ${project.title}`, error);
      }
    }
    
    console.log('✅ Project seeding completed!');
  } catch (error) {
    console.error('❌ Error during project seeding:', error);
    throw error;
  }
}

// Function to run seeding (can be called from API or script)
export async function runSeeding(): Promise<{ success: boolean; message: string }> {
  try {
    await seedProjects();
    return {
      success: true,
      message: `Successfully seeded ${allProjects.length} projects with embeddings`
    };
  } catch (error) {
    return {
      success: false,
      message: `Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
