import { LayoutWrapper } from "@/components/layout-wrapper";
import Hero from "@/app/(sections)/hero/Hero";
import AboutSection from "@/app/(sections)/about/AboutSection";
import SkillsSection from "@/app/(sections)/skills/SkillsSection";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import ProjectsSection from "@/app/(sections)/projects/ProjectsSection";
import MediumFeed from "@/components/MediumFeed";
import ContactSection from "@/app/(sections)/contact/ContactSection";
import { MEDIUM_CONFIG } from "@/lib/medium-config";

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
        {/* Enhanced Medium RSS feed with your actual profile */}
        <MediumFeed 
          username={MEDIUM_CONFIG.USERNAME}
          limit={MEDIUM_CONFIG.DISPLAY.POST_LIMIT}
          showProfile={MEDIUM_CONFIG.DISPLAY.SHOW_PROFILE}
        />
      </section>
      
      <section id="contact">
        <ContactSection />
      </section>
    </LayoutWrapper>
  );
}
