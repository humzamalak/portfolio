'use client';

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <Section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Me
            </h2>
            <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
              I’m a DevOps Engineer with 5+ years of experience modernizing legacy systems into scalable cloud‑native platforms. I lead migrations from monoliths to microservices, build CI/CD that eliminates manual releases, and design observability that lifts reliability. Recent impact: 60% faster deployments, 99.9% uptime, and 40% quicker incident resolution.
            </p>
          </motion.div>
          {/* Single concise paragraph as requested */}
          <motion.div variants={itemVariants} className="text-center"></motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutSection;
