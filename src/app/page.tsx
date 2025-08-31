import Hero from "@/app/(sections)/hero/Hero";
import ExperienceTimeline from "@/app/(sections)/experience/ExperienceTimeline";
import TechnicalBlog from "@/app/(sections)/blog/TechnicalBlog";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ExperienceTimeline />
      <TechnicalBlog />
    </main>
  );
}
