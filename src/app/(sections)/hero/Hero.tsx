'use client';

import { motion, useReducedMotion } from "framer-motion";
import ProfilePicture from "@/components/ProfilePicture";
import Link from "next/link";
import { useMemo, useState } from "react";

const heroStats = [
  { value: "99.9%", label: "target uptime posture" },
  { value: "5+", label: "years operating cloud systems" },
  { value: "0→1", label: "platforms from chaos to calm" },
];

const commandFeed = [
  { time: "00:01", event: "Plan approved", detail: "Rollback path documented before merge", tone: "text-emerald-300" },
  { time: "00:07", event: "Security gate", detail: "Secrets, deps, images and IAM checked", tone: "text-sky-300" },
  { time: "00:13", event: "Deploy window", detail: "Progressive rollout with observable blast radius", tone: "text-violet-300" },
  { time: "00:21", event: "Human control", detail: "Clear halt points, plain-English runbook", tone: "text-amber-200" },
];

const stackSignals = ["AWS", "EKS", "Terraform", "GitHub Actions", "Vault", "Prometheus", "Grafana", "Argo CD"];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const magneticTransform = useMemo(
    () => ({
      x: pointer.x * 22,
      y: pointer.y * 18,
      rotateX: pointer.y * -3,
      rotateY: pointer.x * 4,
    }),
    [pointer],
  );

  return (
    <section
      className="hero-shell relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-slate-950 px-4 pb-16 pt-20 text-white md:pb-20 md:pt-24"
      aria-labelledby="hero-heading"
      onMouseMove={(event) => {
        if (shouldReduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }}
    >
      <div className="hero-aurora pointer-events-none absolute inset-0 -z-30" aria-hidden="true" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-80" aria-hidden="true" />
      <div className="hero-noise pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-32 h-56 w-56 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: pointer.x * 34, y: pointer.y * 20, scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-[10%] h-72 w-72 rounded-full border border-fuchsia-300/15 bg-fuchsia-400/10 blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: pointer.x * -28, y: pointer.y * -18, scale: [1.05, 1, 1.1] }}
        transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="premium-pill border-emerald-300/30 bg-emerald-300/10 text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.95)]" />
              Open to DevOps / Platform roles
            </span>
            <span className="premium-pill border-white/10 bg-white/[0.06] text-slate-300">
              London · Remote-friendly · Production-minded
            </span>
          </div>

          <h1
            id="hero-heading"
            className="max-w-6xl text-balance text-5xl font-black leading-[0.86] tracking-[-0.09em] text-white sm:text-6xl md:text-7xl xl:text-[7.4rem]"
          >
            Cloud systems with a
            <span className="hero-gradient-text block py-2">cinematic calm.</span>
          </h1>

          <p className="mt-6 max-w-3xl text-pretty text-base leading-7 text-slate-300 md:text-lg">
            I turn fragile delivery into command-center-grade platforms: secure AWS foundations,
            Kubernetes that teams can trust, Terraform that tells the truth, and CI/CD paths with
            visible safety rails from commit to production.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.015 }}
                className="premium-card rounded-[1.6rem] p-4"
              >
                <div className="font-mono text-3xl font-black text-white">{stat.value}</div>
                <div className="mt-1 text-sm leading-5 text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#projects"
              aria-label="Jump to selected DevOps projects"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-7 py-4 font-black text-slate-950 shadow-[0_22px_90px_rgba(255,255,255,0.22)] transition duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-cyan-200 via-emerald-200 to-violet-200 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Enter the command center</span>
              <span className="relative ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="https://github.com/humzamalak"
              aria-label="Visit Humza Malak on GitHub"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 font-bold text-white shadow-2xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-200/60 hover:bg-cyan-200/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub systems
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-2xl perspective-1000"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : magneticTransform}
            transition={{ type: "spring", stiffness: 70, damping: 24 }}
            className="relative preserve-3d"
          >
            <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-br from-cyan-300/24 via-blue-500/12 to-fuchsia-400/20 blur-3xl" aria-hidden="true" />
            <div className="premium-console relative overflow-hidden rounded-[2.3rem] p-3 md:p-4">
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-2.5">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.7)]" />
                  <span className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.6)]" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.34em] text-slate-400">ops://humza</span>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.74fr_1fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-4">
                    <ProfilePicture src="/humza-headshot-optimized.jpg" alt="Humza Malak" size={168} />
                  </div>
                  <div className="rounded-[1.8rem] border border-emerald-300/20 bg-emerald-300/10 p-3.5">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-200">operator mode</p>
                    <p className="mt-2 text-xl font-black text-white">Calm under load</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">Automate the boring path. Instrument the scary path. Keep humans in control.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200">release sequence</p>
                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-emerald-200">green</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {commandFeed.map((item) => (
                        <div key={item.event} className="grid grid-cols-[3.2rem_1fr] gap-3 rounded-2xl border border-white/5 bg-white/[0.035] px-3 py-2.5">
                          <span className="font-mono text-xs text-slate-500">{item.time}</span>
                          <span>
                            <span className={`block font-bold ${item.tone}`}>{item.event}</span>
                            <span className="mt-1 block text-xs leading-5 text-slate-400">{item.detail}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 text-left">
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-violet-200">stack constellation</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stackSignals.map((signal) => (
                        <span key={signal} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-slate-100">
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200 md:inline-flex"
        aria-label="Scroll to About section"
      >
        Scroll for the runbook ↓
      </button>
    </section>
  );
};

export default Hero;
