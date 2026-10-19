import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent";
export const CONTACT_EMAIL = "humzatmalak@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/humza-m-64607514b/";
export const GITHUB_URL = "https://github.com/humzamalak";

// On the home page the nav links scroll in place; elsewhere they go back to the home page.
export function SiteHeader({ home = false }: { home?: boolean }) {
  const base = home ? "" : "/";
  return (
    <header className="site-header">
      {home ? <a className="wordmark" href="#top"><span>HM</span><small>platform engineering</small></a> : <Link className="wordmark" href="/"><span>HM</span><small>platform engineering</small></Link>}
      <nav><a href={`${base}#work`}>Work</a><a href={`${base}#notes`}>Field notes</a><a href={`${base}#experience`}>Experience</a><a className="nav-cta" href={`${base}#contact`}>Start a conversation <span>↗</span></a></nav>
    </header>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer section-wrap">
      <div className="footer-contact">
        <span>© {new Date().getFullYear()} Humza Malak · United Kingdom</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </div>
      <nav aria-label="Footer">
        <a href={LINKEDIN_URL} rel="me noopener" target="_blank">LinkedIn</a>
        <a href={GITHUB_URL} rel="me noopener" target="_blank">GitHub</a>
        <Link href="/privacy/">Privacy</Link>
        <Link href="/terms/">Terms</Link>
        <CookieSettingsButton />
        {home ? <a href="#top">Back to top ↑</a> : <Link href="/">Home ↑</Link>}
      </nav>
    </footer>
  );
}

export function SimplePage({ label, title, children }: { label: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="top" className="simple-page section-wrap">
        <div className="section-label">{label}</div>
        <h1>{title}</h1>
        <div className="simple-body">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
