import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata = {
  alternates: { canonical: "/projects/" },
  title: "Projects",
  description: "DevOps and platform projects by Humza Malak: CI/CD pipelines, automation tooling, Kubernetes and cloud infrastructure.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ProjectsSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
