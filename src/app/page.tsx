import Hero from "@/app/(sections)/hero/Hero";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import TechnicalBlog from "@/app/(sections)/blog/TechnicalBlog";
import MetricsDashboard from "@/app/(sections)/metrics/MetricsDashboard";
import ContactSection from "@/app/(sections)/contact/ContactSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ExperienceTimeline />
      <MetricsDashboard />
      <TechnicalBlog />
      <ContactSection />
    </main>
  );
}
