import HomePage from "./home-page";
import { getPublishedNotes } from "@/lib/notes";

// Server wrapper: reads the published notes at build time and passes them to the client page.
export default function Page() {
  const notes = getPublishedNotes().map(({ slug, title, excerpt, category, readTime, date }) => ({ slug, title, excerpt, category, readTime, date }));
  return <HomePage notes={notes} />;
}
