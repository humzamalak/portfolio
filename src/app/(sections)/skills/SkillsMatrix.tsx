"use client";

import { Radar } from "react-chartjs-2";
import { Chart, RadialLinearScale } from "chart.js";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";

// Register Chart.js components
Chart.register(RadialLinearScale);

// Calculate average proficiency for each category
const calculateCategoryAverages = () => {
  return skills.map(category => ({
    name: category.category,
    average: category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length
  }));
};

// Chart data configuration
const chartData = {
  labels: calculateCategoryAverages().map(cat => cat.name),
  datasets: [
    {
      label: "Proficiency Level",
      data: calculateCategoryAverages().map(cat => cat.average),
      backgroundColor: "rgba(59,130,246,0.5)",
      borderColor: "#22c55e",
      borderWidth: 2,
      pointBackgroundColor: "#22c55e",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      type: "radialLinear" as const,
      beginAtZero: true,
      max: 10,
      ticks: {
        stepSize: 2,
        color: "#ffffff",
        font: {
          size: 12,
        },
        backdropColor: "transparent",
      },
      grid: {
        color: "rgba(255,255,255,0.2)",
      },
      angleLines: {
        color: "rgba(255,255,255,0.2)",
      },
      pointLabels: {
        color: "#ffffff",
        font: {
          size: 14,
          weight: "normal" as const,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#22c55e",
      borderWidth: 1,
    },
  },
};



export default function SkillsMatrix() {
  return (
    <section
      id="skills"
      className="w-full bg-neutral-950 text-white py-16 px-4"
      aria-label="Skills Matrix"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left mb-8 md:mb-0 md:absolute md:top-16 md:left-1/2 md:transform md:-translate-x-1/2">
          Skills Matrix
        </h2>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <div className="w-full max-w-md h-80">
            <Radar data={chartData} options={chartOptions} />
          </div>
          <div className="sr-only">
            Radar chart showing category proficiency averages.
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, staggerChildren: 0.1 }}
          className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-6"
        >
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + categoryIndex * 0.1 }}
            >
              {/* Category Name */}
              <h3 className="text-xl font-semibold mb-4 col-span-full text-blue-400">
                {category.category}
              </h3>
              
              {/* Skills in this category */}
              <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + categoryIndex * 0.1 + skillIndex * 0.05 
                    }}
                    className="flex flex-col items-center gap-2"
                    title={`${skill.years} years experience`}
                    aria-label={`${skill.name}, ${skill.years} years experience`}
                  >
                    <div className="w-12 h-12 text-blue-500 hover:text-green-400 transition-colors duration-200 flex items-center justify-center">
                      <skill.icon className="w-8 h-8" />
                    </div>
                    <span className="text-sm text-center text-gray-300">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}