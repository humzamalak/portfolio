import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";

export const metadata = {
  alternates: { canonical: "/projects/" },
  title: "Projects",
  description: "DevOps and platform projects by Humza Malak: CI/CD pipelines, automation tooling, Kubernetes and cloud infrastructure.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        <ProjectsSection />
      </div>
    </main>
  );
}


