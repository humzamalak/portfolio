import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SimplePage } from "@/components/site-chrome";
import { caseStudies, getCaseStudy } from "@/data/case-studies";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(study => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return { title: study.title, description: study.summary, alternates: { canonical: `/work/${study.slug}/` } };
}

export default async function CaseStudyPage({ params }: Params) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  return (
    <SimplePage label={`Case study · ${study.category}`} title={study.title}>
      <p className="case-summary">{study.summary}</p>
      <p className="updated"><a href={study.repo} target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a></p>

      <h2>How it fits together</h2>
      <ol className="case-flow" aria-label="Architecture, from left to right">
        {study.flow.map(stage => (
          <li key={stage.label}>
            <strong>{stage.label}</strong>
            <ul>{stage.items.map(item => <li key={item}>{item}</li>)}</ul>
          </li>
        ))}
      </ol>

      <h2>The problem</h2>
      <p>{study.problem}</p>

      <h2>What I built</h2>
      <ul>{study.built.map(item => <li key={item}>{item}</li>)}</ul>

      <h2>Decisions</h2>
      <ul>{study.decisions.map(item => <li key={item}>{item}</li>)}</ul>

      <h2>What went wrong: {study.lesson.title}</h2>
      <p>{study.lesson.body}</p>

      <h2>What I would improve next</h2>
      <ul>{study.next.map(item => <li key={item}>{item}</li>)}</ul>

      <div className="tag-list case-stack">{study.stack.map(tech => <span key={tech}>{tech}</span>)}</div>
      <p className="updated"><Link href="/projects/">← All projects</Link></p>
    </SimplePage>
  );
}
