import { catalog, type MediumArticle } from "@/data/catalog";
import { caseStudies } from "@/data/case-studies";
import { experience } from "@/data/experience";

// The command logic of the home page terminal. It has no React code, so tests can call it directly.

export type Line = {
  text: string;
  tone?: "muted" | "accent" | "error";
  href?: string; // the line is a link
  external?: boolean;
  run?: string; // the line is a button that runs this command
};
export type Action = { type: "clear" } | { type: "open"; href: string; external: boolean };
export type Result = { lines: Line[]; action?: Action; results?: SearchItem[] };

export type SearchItem = { kind: "project" | "case study" | "role" | "note" | "article"; title: string; text: string; href: string; external: boolean };
export type TerminalNote = { slug: string; title: string; excerpt: string; category: string };

export const COMMANDS: [name: string, usage: string, explanation: string][] = [
  ["help", "help", "Show this list."],
  ["search", "search <words>", "Search projects, case studies, roles and notes."],
  ["ls", "ls [section]", "List projects, work, notes or experience."],
  ["cat", "cat <project>", "Show one project. Example: cat airsnap"],
  ["open", "open <number|project>", "Open a result by number, or a project by name."],
  ["status", "status", "Show the summary that was here when the page loaded."],
  ["whoami", "whoami", "Who made this."],
  ["contact", "contact", "Go to the contact form."],
  ["history", "history", "Show the commands you ran."],
  ["clear", "clear", "Empty the screen."],
];

export const STATUS: Line[] = [
  { text: "role      DevOps / platform engineer" },
  { text: "since     2020 · 4 roles, UK remote" },
  { text: "cloud     AWS (EKS, EC2, S3, IAM) · Cloudflare" },
  { text: "delivery  Terraform · Argo CD · GitHub Actions" },
  { text: "observe   Prometheus · Grafana · ELK" },
];

export function buildIndex(notes: TerminalNote[], articles: MediumArticle[]): SearchItem[] {
  return [
    ...catalog.map(entry => ({ kind: "project" as const, title: entry.title, text: [entry.id, entry.description, entry.language, ...entry.tags].join(" "), href: entry.caseStudy ? `/work/${entry.caseStudy}/` : entry.repoUrl, external: !entry.caseStudy })),
    ...caseStudies.map(study => ({ kind: "case study" as const, title: study.lesson.title, text: [study.title, study.summary, study.lesson.body].join(" "), href: `/work/${study.slug}/`, external: false })),
    ...experience.map(role => ({ kind: "role" as const, title: `${role.role}, ${role.company}`, text: [role.description, ...role.achievements, ...role.techStack, ...role.highlights].join(" "), href: "/#experience", external: false })),
    ...notes.map(note => ({ kind: "note" as const, title: note.title, text: [note.excerpt, note.category].join(" "), href: `/notes/${note.slug}/`, external: false })),
    ...articles.map(article => ({ kind: "article" as const, title: article.title, text: [article.excerpt, ...article.tags].join(" "), href: article.url, external: true })),
  ];
}

export function search(index: SearchItem[], query: string): SearchItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return index
    .map(item => {
      const title = item.title.toLowerCase();
      const body = `${title} ${item.text.toLowerCase()}`;
      if (!words.every(word => body.includes(word))) return null;
      // A match in the title ranks above a match in the body text.
      return { item, score: words.filter(word => title.includes(word)).length };
    })
    .filter((match): match is { item: SearchItem; score: number } => match !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(match => match.item);
}

const resultLines = (items: SearchItem[]): Line[] => items.map((item, index) => ({ text: `${index + 1}  [${item.kind}] ${item.title}`, href: item.href, external: item.external }));
const findProject = (name: string) => catalog.find(entry => entry.id === name) ?? catalog.find(entry => entry.id.includes(name) || entry.title.toLowerCase().includes(name));

// Complete a command name, or a project name after "cat" or "open". Returns the input unchanged when there is no single match.
export function complete(input: string): string {
  const [command, ...rest] = input.trimStart().split(/\s+/);
  if (rest.length === 0) {
    const matches = COMMANDS.filter(([name]) => name.startsWith(command.toLowerCase()));
    return matches.length === 1 ? `${matches[0][0]} ` : input;
  }
  if (["cat", "open"].includes(command) && rest.length === 1) {
    const matches = catalog.filter(entry => entry.id.startsWith(rest[0].toLowerCase()));
    return matches.length === 1 ? `${command} ${matches[0].id}` : input;
  }
  return input;
}

export function run(input: string, context: { index: SearchItem[]; lastResults: SearchItem[]; history: string[]; notes: TerminalNote[]; articles: MediumArticle[] }): Result {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const argument = args.join(" ").toLowerCase();
  switch (command.toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
    case "?":
      return { lines: [
        { text: "Type a command and press Enter. Tab completes a name. Arrow up repeats a command.", tone: "muted" },
        // Two short lines for each command: the panel is narrow, and padded columns wrap badly.
        ...COMMANDS.flatMap(([, usage, explanation]): Line[] => [{ text: usage, tone: "accent" }, { text: `  ${explanation}`, tone: "muted" }]),
        { text: "Try one:", tone: "muted" },
        { text: "search terraform", run: "search terraform" },
        { text: "ls projects", run: "ls projects" },
      ] };
    case "search":
    case "grep":
    case "find": {
      if (!argument) return { lines: [{ text: "Usage: search <words>. Example: search kubernetes", tone: "error" }] };
      const results = search(context.index, argument);
      if (results.length === 0) return { lines: [{ text: `No match for "${argument}". Try a tool name, for example terraform, vault or jenkins.`, tone: "muted" }], results: [] };
      return { lines: [...resultLines(results), { text: 'Click a result, or type "open 1".', tone: "muted" }], results };
    }
    case "ls":
    case "dir": {
      if (!argument) return { lines: [{ text: "projects/", run: "ls projects" }, { text: "work/", run: "ls work" }, { text: "notes/", run: "ls notes" }, { text: "experience/", run: "ls experience" }] };
      const section = argument.replace(/\/$/, "");
      let results: SearchItem[];
      if (section === "projects") results = context.index.filter(item => item.kind === "project");
      else if (section === "work") results = caseStudies.map(study => ({ kind: "case study" as const, title: study.title, text: "", href: `/work/${study.slug}/`, external: false }));
      else if (section === "notes") results = context.index.filter(item => item.kind === "note" || item.kind === "article");
      else if (section === "experience") results = context.index.filter(item => item.kind === "role");
      else return { lines: [{ text: `ls: ${section}: no such section. Sections: projects, work, notes, experience.`, tone: "error" }] };
      if (results.length === 0) return { lines: [{ text: "Nothing here yet.", tone: "muted" }], results: [] };
      return { lines: [...resultLines(results), { text: 'Click a line, or type "open 1".', tone: "muted" }], results };
    }
    case "cat": {
      if (!argument) return { lines: [{ text: "Usage: cat <project>. Example: cat airsnap", tone: "error" }] };
      const entry = findProject(argument);
      if (!entry) return { lines: [{ text: `cat: ${argument}: no such project. Type "ls projects" to see the names.`, tone: "error" }] };
      return { lines: [
        { text: entry.title, tone: "accent" },
        { text: entry.description },
        { text: `${entry.language} · last push ${entry.pushed} · ${entry.tags.join(", ")}`, tone: "muted" },
        ...(entry.caseStudy ? [{ text: "Read the case study ↗", href: `/work/${entry.caseStudy}/` }] : []),
        { text: "Open the repository on GitHub ↗", href: entry.repoUrl, external: true },
      ] };
    }
    case "open":
    case "cd": {
      if (!argument) return { lines: [{ text: "Usage: open <number|project>. Run a search first to get numbers.", tone: "error" }] };
      const numbered = /^\d+$/.test(argument) ? context.lastResults[Number(argument) - 1] : undefined;
      const entry = numbered ? undefined : findProject(argument);
      const target = numbered ?? (entry && { title: entry.title, href: entry.caseStudy ? `/work/${entry.caseStudy}/` : entry.repoUrl, external: !entry.caseStudy });
      if (!target) return { lines: [{ text: `open: ${argument}: not found. Run "search" or "ls projects" first.`, tone: "error" }] };
      return { lines: [{ text: `Opening ${target.title} ...`, tone: "muted" }], action: { type: "open", href: target.href, external: target.external } };
    }
    case "status":
      return { lines: STATUS };
    case "whoami":
      return { lines: [{ text: "Humza Malak. DevOps engineer in the UK. I make releases boring." }, { text: "You: a visitor with good taste in input devices.", tone: "muted" }] };
    case "contact":
    case "mail":
      return { lines: [{ text: "Going to the contact form ...", tone: "muted" }], action: { type: "open", href: "/#contact", external: false } };
    case "history":
      return { lines: context.history.length > 0 ? context.history.map((entry, index) => ({ text: `${String(index + 1).padStart(3)}  ${entry}` })) : [{ text: "No commands yet.", tone: "muted" }] };
    case "clear":
    case "cls":
      return { lines: [], action: { type: "clear" } };
    case "sudo":
      return { lines: [{ text: "visitor is not in the sudoers file. This incident will be reported.", tone: "error" }] };
    case "kubectl":
      return { lines: [
        { text: "NAME          READY   STATUS    RESTARTS", tone: "muted" },
        { text: "hero          1/1     Running   0" },
        { text: "work          1/1     Running   0" },
        { text: "experience    1/1     Running   0" },
        { text: "contact       1/1     Running   0" },
        { text: "This page is static files on Cloudflare. There are no pods. It still feels good to check.", tone: "muted" },
      ] };
    case "exit":
    case "quit":
      return { lines: [{ text: "There is no exit. There is a contact form.", tone: "muted" }, { text: "contact", run: "contact" }] };
    case "rm":
      return { lines: [{ text: "rm: permission denied. Good.", tone: "error" }] };
    default:
      return { lines: [{ text: `${command}: command not found. Type "help" to see the commands.`, tone: "error" }, { text: "help", run: "help" }] };
  }
}
