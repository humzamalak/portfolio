'use client';

import { motion, useReducedMotion } from "framer-motion";
import ProfilePicture from "@/components/ProfilePicture";
import Link from "next/link";
import { useState } from "react";

const heroStats = [
  { value: "5+", label: "years in cloud ops" },
  { value: "24/7", label: "reliability mindset" },
  { value: "IaC", label: "repeatable by default" },
];

const orbitSignals = ["Kubernetes", "Terraform", "AWS", "GitOps", "DevSecOps", "Observability"];

const liveSystems = [
  { label: "Deploy health", value: "green", tone: "bg-emerald-400" },
  { label: "Security gate", value: "armed", tone: "bg-sky-400" },
  { label: "Cost drift", value: "watched", tone: "bg-amber-300" },
];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: "easeOut" as const } },
  };

  return (
    <section
      className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-background px-4 pb-24 pt-20 text-foreground md:pb-28 md:pt-24"
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
      <div className="hero-aurora pointer-events-none absolute inset-0 -z-20" aria-hidden="true" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-500/20 bg-primary-500/5 blur-0"
        animate={shouldReduceMotion ? undefined : { x: pointer.x * 18, y: pointer.y * 18 }}
        transition={{ type: "spring", stiffness: 55, damping: 22 }}
      />

      <div className="container mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.14)]">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              Open to DevOps / Platform roles
            </span>
            <span className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-sm text-foreground-muted backdrop-blur">
              London · remote-friendly · production-minded
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            id="hero-heading"
            className="mx-auto max-w-5xl text-balance text-5xl font-black tracking-[-0.08em] text-foreground sm:text-6xl md:text-7xl lg:mx-0 lg:text-8xl"
          >
            I build cloud systems that feel
            <span className="hero-gradient-text block">unreasonably calm.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-8 text-foreground-muted md:text-xl lg:mx-0"
          >
            I’m Humza Malak — a DevOps engineer turning fragile releases into secure, observable,
            self-healing platforms with Kubernetes, AWS, Terraform, CI/CD and DevSecOps automation.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-border/70 bg-background/55 p-4 text-left shadow-soft backdrop-blur-xl">
                <div className="font-mono text-2xl font-black text-primary-400">{stat.value}</div>
                <div className="mt-1 text-sm leading-5 text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Link
              href="/#projects"
              aria-label="Jump to selected DevOps projects"
              className="group inline-flex w-full items-center justify-center rounded-2xl bg-primary-500 px-7 py-4 font-bold text-primary-foreground shadow-[0_18px_70px_rgba(37,99,235,0.38)] transition duration-300 hover:-translate-y-1 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 sm:w-auto"
            >
              Enter the command center
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="https://github.com/humzamalak"
              aria-label="Visit Humza Malak on GitHub"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-border bg-background/70 px-7 py-4 font-bold text-foreground shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary-400/70 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub systems
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary-500/20 via-sky-400/10 to-emerald-400/20 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.32em] text-slate-400">platform.ops</span>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.82fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <ProfilePicture src="/humza-headshot-optimized.jpg" alt="Humza Malak" size={192} />
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-200">current mode</p>
                  <p className="mt-2 text-2xl font-black text-white">Ship safely</p>
                  <p className="mt-2 text-sm text-slate-300">Automate the boring path. Instrument the scary path. Keep humans in control.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-sky-200">live stack map</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {orbitSignals.map((signal) => (
                      <span key={signal} className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-100">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-violet-200">release telemetry</p>
                  <div className="mt-4 space-y-3">
                    {liveSystems.map((system) => (
                      <div key={system.label} className="flex items-center justify-between gap-3 rounded-2xl bg-black/20 px-3 py-2">
                        <span className="flex items-center gap-2 text-sm text-slate-300">
                          <span className={`h-2.5 w-2.5 rounded-full ${system.tone}`} />
                          {system.label}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-100">{system.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-foreground-muted backdrop-blur transition hover:border-primary-400 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 md:inline-flex"
        aria-label="Scroll to About section"
      >
        Scroll for the runbook ↓
      </button>
    </section>
  );
};

export default Hero;
