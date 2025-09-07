import { LayoutWrapper } from "@/components/layout-wrapper";
import Hero from "@/app/(sections)/hero/Hero";
import AboutSection from "@/app/(sections)/about/AboutSection";
import SkillsSection from "@/app/(sections)/skills/SkillsSection";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";
import TechnicalBlog from "@/app/(sections)/blog/TechnicalBlog";
import ContactSection from "@/app/(sections)/contact/ContactSection";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <section id="hero">
        <Hero />
      </section>
      
      <section id="about">
        <AboutSection />
      </section>
      
      <section id="skills">
        <SkillsSection />
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
