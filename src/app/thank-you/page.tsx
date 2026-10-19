import Link from "next/link";
import type { Metadata } from "next";
import { SimplePage } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Message sent",
  description: "Thanks for getting in touch.",
  alternates: { canonical: "/thank-you/" },
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <SimplePage label="Message sent" title={<>Thanks.<br />I&apos;ll be <em>in touch.</em></>}>
      <p>Your message reached my inbox. I will reply with a clear next step.</p>
      <div className="hero-actions"><Link className="button button-dark" href="/#work">See selected work <span>↓</span></Link><Link className="text-link" href="/">Back to the home page</Link></div>
    </SimplePage>
  );
}
