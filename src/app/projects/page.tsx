import type { Metadata } from "next";
import { GITHUB_URL, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { projects } from "@/data/projects";
import { caseStudyForRepo } from "@/data/case-studies";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/" },
  title: "Projects",
  description: "DevOps and platform projects by Humza Malak: CI/CD pipelines, automation tooling, Kubernetes and cloud infrastructure.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="work section-wrap projects-page">
        <div className="section-heading">
          <div>
            <div className="section-label">Work <span>All projects</span></div>
            <h1>Every build,<br /><em>in the open.</em></h1>
          </div>
          <p>Projects with a case study open it here. The others link to their source on GitHub.</p>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <a className="project-row" key={project.title} {...(caseStudyForRepo(project.link) ? { href: `/work/${caseStudyForRepo(project.link)!.slug}/`, "aria-label": `${project.title}: case study` } : { href: project.link, target: "_blank", rel: "noopener noreferrer", "aria-label": `${project.title} on GitHub` })}>
              <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="project-type">{project.category}</p>
                <h2>{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <div className="tag-list">{project.techStack.map(tech => <span key={tech}>{tech}</span>)}</div>
              </div>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <a className="text-link work-all" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">All repositories on GitHub <span>↗</span></a>
      </main>
      <SiteFooter />
    </>
  );
}
