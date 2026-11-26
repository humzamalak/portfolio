import { buildIndex, complete, run, search } from "@/lib/terminal";

const index = buildIndex([{ slug: "a-note", title: "A note about queues", excerpt: "Backpressure", category: "Build log" }], [{ title: "Vault on Medium", url: "https://medium.com/@someone/vault-1", date: "2026-01-02", tags: ["vault"], excerpt: "Secrets", readTime: "3 min read" }]);
const context = { index, lastResults: [], history: [], notes: [], articles: [] };

describe("terminal", () => {
  it("explains the commands", () => {
    const text = run("help", context).lines.map(line => line.text).join("\n");
    for (const command of ["search", "ls", "cat", "open", "clear"]) expect(text).toContain(command);
  });

  it("finds projects, notes and Medium articles", () => {
    expect(search(index, "eks gitops")[0].title).toBe("Production-Ready EKS Cluster with GitOps");
    expect(search(index, "queues")[0]).toMatchObject({ kind: "note", href: "/notes/a-note/", external: false });
    expect(search(index, "vault medium")[0]).toMatchObject({ kind: "article", external: true });
    expect(search(index, "no-such-thing-xyz")).toEqual([]);
  });

  it("opens a search result by its number", () => {
    const found = run("search bash toolkit", context);
    expect(found.results!.length).toBeGreaterThan(0);
    const opened = run("open 1", { ...context, lastResults: found.results! });
    expect(opened.action).toEqual({ type: "open", href: found.results![0].href, external: found.results![0].external });
  });

  it("opens a project with no case study on GitHub", () => {
    expect(run("open airsnap", context).action).toEqual({ type: "open", href: "https://github.com/humzamalak/airsnap", external: true });
  });

  it("tells the visitor what to do after a wrong command", () => {
    expect(run("frobnicate", context).lines[0].text).toContain('Type "help"');
    expect(run("search", context).lines[0].text).toContain("Usage");
    expect(run("open 9", context).lines[0].tone).toBe("error");
  });

  it("completes command and project names", () => {
    expect(complete("sea")).toBe("search ");
    expect(complete("cat airs")).toBe("cat airsnap");
    expect(complete("c")).toBe("c"); // cat, contact, clear: more than one match
  });
});
