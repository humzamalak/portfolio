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
          </motion.div>
          <motion.div variants={itemVariants} className="text-center">
            <div className="text-lg text-foreground-muted max-w-3xl mx-auto">
              <p>
                I am a DevOps Engineer with over 5 years of experience building secure, scalable, and automated cloud infrastructure. I specialize in modernizing legacy systems into Kubernetes-based microservices, designing multi-region AWS environments with Terraform, and streamlining deployments through CI/CD pipelines in Jenkins, GitHub Actions, and GitLab CI.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutSection;
