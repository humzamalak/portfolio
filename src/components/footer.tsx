import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "https://medium.com/@humzamalak" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white" role="contentinfo" aria-label="Site Footer">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="premium-card grid gap-8 rounded-[2rem] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <Link href="/" className="inline-flex rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:border-cyan-200/60 hover:text-cyan-100">
              HM / Ops
            </Link>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              © {currentYear} Humza Malak — DevOps Engineer. Built as a living command center for reliability, automation, and cloud platform work.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://github.com/humzamalak" aria-label="GitHub profile" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200" target="_blank" rel="noopener noreferrer">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </Link>
            <Link href="https://www.linkedin.com/in/humza-m-64607514b/" aria-label="LinkedIn profile" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200" target="_blank" rel="noopener noreferrer">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </Link>
            <Link href="/#contact" aria-label="Send email" className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-slate-300 transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </Link>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm" aria-label="Quick Links">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="rounded-full px-3 py-2 font-bold text-slate-400 transition hover:bg-white/[0.055] hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
