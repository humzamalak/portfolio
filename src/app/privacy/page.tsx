import type { Metadata } from "next";
import { CONTACT_EMAIL, SimplePage } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What data humzamalak.dev collects, why, and how to ask for it to be deleted.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <SimplePage label="Legal · Privacy" title={<>Privacy <em>policy.</em></>}>
      <p className="updated">Last updated: 9 October 2026</p>
      <h2>Who is responsible</h2>
      <p>Humza Malak, United Kingdom, runs this site and controls the data described here. Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      <h2>What I collect</h2>
      <ul>
        <li><strong>Contact form.</strong> Your name, email address and message. I use them only to reply to you.</li>
        <li><strong>Visit statistics.</strong> Only if you click Accept on the cookie banner. The site then loads Cloudflare Web Analytics or Google Analytics to count page views. Google Analytics sets cookies (names start with <code>_ga</code>) that last up to two years.</li>
        <li><strong>Server logs.</strong> Cloudflare, which hosts the site, processes your IP address to deliver pages and stop abuse.</li>
      </ul>
      <h2>Cookies</h2>
      <p>Without your consent, the site sets no cookies. Your choice is saved in your browser (local storage, key <code>analytics-consent</code>). You can change it at any time with &ldquo;Cookie settings&rdquo; in the footer.</p>
      <h2>Who processes the data</h2>
      <ul>
        <li>Cloudflare (hosting, security, and analytics if you accept).</li>
        <li>Resend (sends the contact form to my inbox).</li>
        <li>Google (my email inbox, the web fonts on this site, and Google Analytics if you accept).</li>
      </ul>
      <p>Some of these providers process data outside the UK under standard data protection safeguards.</p>
      <h2>How long I keep it</h2>
      <p>I keep contact messages for as long as the conversation is useful, and no longer than two years.</p>
      <h2>Your rights</h2>
      <p>Under UK GDPR you can ask to see, correct or delete your data, or object to its use. Email me and I will act within one month. You can also complain to the Information Commissioner&apos;s Office (ico.org.uk).</p>
    </SimplePage>
  );
}
