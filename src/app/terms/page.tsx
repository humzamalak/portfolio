import type { Metadata } from "next";
import { CONTACT_EMAIL, SimplePage } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use humzamalak.dev.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <SimplePage label="Legal · Terms" title={<>Terms of <em>use.</em></>}>
      <p className="updated">Last updated: 9 October 2026</p>
      <h2>About this site</h2>
      <p>humzamalak.dev is the personal portfolio of Humza Malak. It describes my work and lets you contact me.</p>
      <h2>Content</h2>
      <p>The text, design and images on this site are mine unless stated otherwise. You may link to and quote them with credit. Do not copy the site as a whole.</p>
      <h2>No advice</h2>
      <p>Field notes and project descriptions are general information, not professional advice for your systems. Any paid work is agreed separately in writing.</p>
      <h2>Liability</h2>
      <p>The site is provided as it is. I am not liable for loss caused by using it, except where the law does not allow that limit.</p>
      <h2>Law</h2>
      <p>These terms follow the law of England and Wales.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </SimplePage>
  );
}
