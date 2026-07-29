'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiCheck, FiX } from "react-icons/fi";

interface FormData {
  name: string;
  email: string;
  message: string;
  inquiryType: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "consulting", label: "Consulting Work" },
  { value: "freelance", label: "Freelance Project" },
  { value: "job", label: "Job Opportunity" },
  { value: "collaboration", label: "Collaboration" },
];

const responseSignals = [
  "Cloud platform roles",
  "DevOps consulting",
  "Infrastructure reviews",
  "CI/CD rescue missions",
];

const inputClass = (hasError?: boolean) =>
  `w-full rounded-2xl border px-4 py-3 text-white placeholder-slate-500 shadow-inner transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
    hasError
      ? "border-red-400/70 bg-red-950/30"
      : "border-white/10 bg-black/24 focus:border-cyan-200/70"
  }`;

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    inquiryType: "general",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isAvailable] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "submit", {
        event_category: "contact_form",
        event_label: "portfolio_contact",
        value: 1,
      });
    }

    try {
      const apiEndpoint = process.env.NODE_ENV === "production" ? "/.netlify/functions/contact" : "/api/contact";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "", inquiryType: "general" });
      } else {
        setSubmitStatus("error");
        console.error("Contact form error:", {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-950 py-28 text-white" aria-label="Contact Section">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_30rem),radial-gradient(circle_at_86%_70%,rgba(16,185,129,0.12),transparent_28rem)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.58, ease: "easeOut" }}
          className="lg:sticky lg:top-28"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">
            {isAvailable ? <FiCheck className="h-4 w-4" /> : <FiX className="h-4 w-4" />}
            {isAvailable ? "Available for Consulting & Freelance Work" : "Currently Not Taking New Projects"}
          </div>
          <h2 className="mt-5 text-balance text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white md:text-7xl">Get In Touch</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Bring the messy deployment, the half-trusted cluster, the fragile pipeline, or the role that needs someone calm at the controls.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {responseSignals.map((signal) => (
              <div key={signal} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-slate-200 backdrop-blur">
                {signal}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <motion.a
              href="https://github.com/humzamalak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              whileHover={{ y: -2 }}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <FaGithub className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/humzamalak"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              whileHover={{ y: -2 }}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-cyan-200/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            >
              <FaLinkedin className="h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.58, ease: "easeOut" }}
          className="premium-console rounded-[2.4rem] p-4 md:p-6"
        >
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/24 px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200">transmission form</span>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">encrypted intent</span>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4" data-analytics="contact">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-200">Name *</label>
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} className={inputClass(Boolean(errors.name))} placeholder="Your name" />
                {errors.name && <p className="mt-2 text-sm text-red-300">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-200">Email *</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={inputClass(Boolean(errors.email))} placeholder="your.email@example.com" />
                {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="inquiryType" className="mb-2 block text-sm font-bold text-slate-200">Inquiry Type</label>
              <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} className={inputClass()}>
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-slate-950 text-white">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-200">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className={`${inputClass(Boolean(errors.message))} resize-y`} placeholder="Tell me about your project or inquiry..." />
              {errors.message && <p className="mt-2 text-sm text-red-300">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-2xl px-6 py-4 font-black transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                isSubmitting
                  ? "cursor-not-allowed bg-slate-600 text-slate-300"
                  : "bg-white text-slate-950 shadow-[0_22px_90px_rgba(255,255,255,0.16)] hover:-translate-y-1 hover:bg-cyan-100"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus === "success" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100" role="status" aria-live="polite">
                ✅ Your message has been sent! I&apos;ll get back to you soon.
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold text-red-100" role="status" aria-live="polite">
                ❌ Something went wrong. Please try again or reach out via email.
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
