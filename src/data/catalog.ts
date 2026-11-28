import repos from "./github-repos.json";
import articles from "./medium-articles.json";
import medium from "./medium.json";
import { projects } from "./projects";
import { caseStudyForRepo } from "./case-studies";

// One entry for each public GitHub repository. scripts/sync-content.mjs refreshes the repository
// list before each build. A repository that is also in projects.ts uses the title, description
// and tags written there; the others use the text from GitHub.
export type CatalogEntry = {
  id: string; // repository name in lower case, used by the terminal ("open airsnap")
  title: string;
  description: string;
  language: string;
  tags: string[];
  pushed: string; // YYYY-MM-DD
  repoUrl: string;
  caseStudy?: string; // slug of /work/<slug>/
};

export const catalog: CatalogEntry[] = repos.map(repo => {
  const curated = projects.find(project => project.link.toLowerCase() === repo.url.toLowerCase());
  return {
    id: repo.name.toLowerCase().replace(/-+$/, ""),
    title: curated?.title ?? repo.name.replace(/-+/g, " ").trim(),
    description: curated?.description ?? (repo.description.trim() || "No description on GitHub yet. Open the repository to see the code."),
    language: repo.language || "Docs",
    tags: (curated?.techStack ?? (repo.topics.length > 0 ? repo.topics : [repo.language || "Docs"])).slice(0, 5),
    pushed: repo.pushed,
    repoUrl: repo.url,
    caseStudy: caseStudyForRepo(repo.url)?.slug,
  };
});

export type MediumArticle = { title: string; url: string; date: string; tags: string[]; excerpt: string; readTime: string };
export const mediumArticles: MediumArticle[] = articles;
// Empty until a user name is set in medium.json.
export const MEDIUM_URL = medium.user ? `https://medium.com/@${medium.user.replace(/^@/, "")}` : "";
