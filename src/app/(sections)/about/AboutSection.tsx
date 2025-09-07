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
              Passionate DevOps Engineer with a track record of transforming legacy systems into modern, scalable cloud-native architectures.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Bio */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  DevOps Engineering Excellence
                </h3>
                <p className="text-foreground-muted leading-relaxed">
                  With over 5 years of experience in DevOps engineering, I specialize in building robust, 
                  scalable infrastructure that powers modern applications. My expertise spans across cloud platforms, 
                  containerization, automation, and observability.
                </p>
                <p className="text-foreground-muted leading-relaxed">
                  I&apos;ve successfully led migrations from monolithic architectures to microservices, 
                  implemented comprehensive CI/CD pipelines, and established monitoring solutions that 
                  have significantly improved system reliability and developer productivity.
                </p>
              </div>

              {/* Key Achievements */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-foreground">
                  Key Achievements
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground-muted">
                      Reduced deployment times by 60% through microservices migration and pipeline optimization
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground-muted">
                      Achieved 99.9% uptime across production environments with comprehensive monitoring
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground-muted">
                      Cut incident resolution time by 40% with observability tools and automated alerting
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground-muted">
                      Eliminated manual release processes by 70% through CI/CD automation
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Tech Stack Overview */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-background-secondary rounded-xl p-6 border border-border">
                <h4 className="text-xl font-semibold text-foreground mb-4">
                  Core Technologies
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Cloud Platforms</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-sm rounded-full">AWS</span>
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-sm rounded-full">GCP</span>
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-600 text-sm rounded-full">Azure</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Containerization</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-secondary-500/10 text-secondary-600 text-sm rounded-full">Kubernetes</span>
                      <span className="px-3 py-1 bg-secondary-500/10 text-secondary-600 text-sm rounded-full">Docker</span>
                      <span className="px-3 py-1 bg-secondary-500/10 text-secondary-600 text-sm rounded-full">Helm</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">Infrastructure</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-accent-500/10 text-accent-600 text-sm rounded-full">Terraform</span>
                      <span className="px-3 py-1 bg-accent-500/10 text-accent-600 text-sm rounded-full">Ansible</span>
                      <span className="px-3 py-1 bg-accent-500/10 text-accent-600 text-sm rounded-full">CloudFormation</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-foreground">CI/CD</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full">Jenkins</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full">GitLab CI</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full">GitHub Actions</span>
                    </div>
                  </div>
                </div>
              </div>              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default AboutSection;
