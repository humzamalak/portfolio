import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Hero from "@/app/(sections)/hero/Hero";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import SkillsMatrix from "@/app/(sections)/skills/SkillsMatrix";
import TechnicalBlog from "@/app/(sections)/blog/TechnicalBlog";
import MetricsDashboard from "@/app/(sections)/metrics/MetricsDashboard";
import ContactSection from "@/app/(sections)/contact/ContactSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <ExperienceTimeline />
        <SkillsMatrix />
        <MetricsDashboard />
        <TechnicalBlog />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
