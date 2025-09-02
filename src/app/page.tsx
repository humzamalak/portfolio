import { LayoutWrapper } from "@/components/layout-wrapper";
import Hero from "@/app/(sections)/hero/Hero";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import TechnicalBlog from "@/app/(sections)/blog/TechnicalBlog";
import ContactSection from "@/app/(sections)/contact/ContactSection";
import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <section id="hero">
        <Hero />
      </section>
      
      <section id="experience">
        <ExperienceTimeline />
      </section>
      
      <section id="projects">
        <ProjectsSection />
      </section>

      <section id="blog">
        <TechnicalBlog />
      </section>
      
      <section id="contact">
        <ContactSection />
      </section>
    </LayoutWrapper>
  );
}
