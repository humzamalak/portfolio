import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";

export const metadata = {
  title: "Projects | Humza Malak",
  description: "A collection of projects showcasing work across frontend, backend, and cloud.",
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


