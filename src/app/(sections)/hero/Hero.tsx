'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  return (
    <header className="h-screen flex flex-col items-center justify-center text-center bg-gray-900 text-white px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Image */}
        <motion.div variants={itemVariants}>
          <Image
            src="/globe.svg"
            alt="Profile icon"
            width={160}
            height={160}
            className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-blue-500 shadow-lg mx-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1 
          variants={itemVariants}
          className="mt-6 text-2xl md:text-4xl lg:text-5xl font-bold"
        >
          Building Scalable, Secure Cloud Infrastructure
        </motion.h1>

        {/* Metrics Line */}
        <motion.p 
          variants={itemVariants}
          className="mt-4 text-base md:text-lg lg:text-xl text-gray-400"
        >
          5+ Years Experience • 99.9% Uptime Achieved • 60% Deployment Optimization
        </motion.p>

        {/* Call To Action Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-auto"
        >
          <Link
            href="https://github.com/humzamalak"
            aria-label="GitHub profile"
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium text-center w-full md:w-auto"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/humza-m-64607514b/"
            aria-label="LinkedIn profile"
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium text-center w-full md:w-auto"
          >
            LinkedIn
          </Link>
          <Link
            href="#projects"
            aria-label="Scroll to Projects"
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-medium text-center w-full md:w-auto"
          >
            View Projects
          </Link>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Hero;
