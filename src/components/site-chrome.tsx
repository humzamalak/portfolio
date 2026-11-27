import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent";
export const CONTACT_EMAIL = "humzatmalak@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/humza-m-64607514b/";
export const GITHUB_URL = "https://github.com/humzamalak";

// On the home page the nav links scroll in place; elsewhere they go back to the home page.
// onRoom is set on the home page: it shows the button that goes back to the 3D room.
export function SiteHeader({ home = false, onRoom }: { home?: boolean; onRoom?: () => void }) {
  const base = home ? "" : "/";
  const hasNotes = process.env.NEXT_PUBLIC_HAS_NOTES === "1";
  return (
    <header className="site-header">
      {home ? <a className="wordmark" href="#top"><span>HM</span><small>platform engineering</small></a> : <Link className="wordmark" href="/"><span>HM</span><small>platform engineering</small></Link>}
      <nav><a href={`${base}#work`}>Work</a>{hasNotes && <a href={home ? "#notes" : "/notes/"}>Field notes</a>}<a href={`${base}#experience`}>Experience</a>{onRoom && <button type="button" className="nav-game nav-room" onClick={onRoom}>3D room</button>}<Link className="nav-game" href="/lab/"><span aria-hidden="true">▶</span> Play<b> On call</b></Link><a className={home ? "nav-cta nav-cta-home" : "nav-cta"} href={`${base}#contact`}>Start a conversation <span>↗</span></a></nav>
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
