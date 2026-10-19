import Link from "next/link";
import type { Metadata } from "next";
import { SimplePage } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SimplePage label="404 · Not found" title={<>This page<br />is <em>off the map.</em></>}>
      <p>The link may be old, or the page may have moved. Everything that exists is one click away.</p>
      <div className="hero-actions"><Link className="button button-dark" href="/">Back to the home page</Link><Link className="text-link" href="/#contact">Start a conversation <span>↗</span></Link></div>
    </SimplePage>
  );
}
