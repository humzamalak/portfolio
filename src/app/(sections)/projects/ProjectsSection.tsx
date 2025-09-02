"use client";

import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

const sampleProjects: Project[] = [
  {
    title: "Portfolio Site",
    description: "Next.js 14 + TailwindCSS portfolio with MDX blog and Netlify functions.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "https://github.com/humzamalak",
  },
  {
    title: "Serverless Tools",
    description: "Reusable Netlify serverless utilities for email and GitHub integrations.",
    tags: ["Netlify", "API", "Resend"],
  },
  {
    title: "UI Components",
    description: "Accessible, responsive components with Radix + shadcn patterns.",
    tags: ["UI", "Accessibility", "Radix"],
  },
];

export default function ProjectsSection() {
  return (
    <section
      className="w-full bg-background text-foreground py-16 px-4"
      aria-label="Projects"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map((project, idx) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="w-full bg-background-secondary rounded-xl border border-border p-6 hover:border-primary-500 transition-colors"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">{project.title}</h3>
              <p className="text-sm text-foreground-muted mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-background-tertiary text-xs text-foreground-muted rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View on GitHub
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


