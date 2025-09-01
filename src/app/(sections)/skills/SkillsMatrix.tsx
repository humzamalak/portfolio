"use client";

import { Radar } from "react-chartjs-2";
import { Chart, RadialLinearScale } from "chart.js";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import { Section } from "@/components/ui/section";

// Register Chart.js components
Chart.register(RadialLinearScale);

// Calculate average proficiency for each category
const calculateCategoryAverages = () => {
  return skills.map(category => ({
    name: category.name,
    average: category.skills.reduce((sum, skill) => sum + skill.proficiency, 0) / category.skills.length
  }));
};

// Chart data configuration
const chartData = {
  labels: calculateCategoryAverages().map(cat => cat.name),
  datasets: [
    {
      label: "Proficiency Level",
      data: calculateCategoryAverages().map(cat => cat.average),
      backgroundColor: "hsla(var(--primary-500), 0.3)",
      borderColor: "hsl(var(--secondary-500))",
      borderWidth: 2,
      pointBackgroundColor: "hsl(var(--secondary-500))",
      pointBorderColor: "hsl(var(--background))",
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
        color: "hsl(var(--foreground))",
        font: {
          size: 12,
        },
        backdropColor: "transparent",
      },
      grid: {
        color: "hsla(var(--foreground), 0.2)",
      },
      angleLines: {
        color: "hsla(var(--foreground), 0.2)",
      },
      pointLabels: {
        color: "hsl(var(--foreground))",
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
      backgroundColor: "hsla(var(--background), 0.95)",
      titleColor: "hsl(var(--foreground))",
      bodyColor: "hsl(var(--foreground))",
      borderColor: "hsl(var(--secondary-500))",
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
};

export default function SkillsMatrix() {
  return (
    <Section
      id="skills"
      className="bg-background-secondary"
      aria-labelledby="skills-heading"
    >
      <div className="text-center mb-12">
        <motion.h2
          id="skills-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Skills Matrix
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-foreground-muted max-w-2xl mx-auto"
        >
          Comprehensive expertise across cloud infrastructure, DevOps, and security technologies
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md h-80 bg-background rounded-2xl p-6 shadow-soft">
            <Radar data={chartData} options={chartOptions} />
          </div>
          <div className="sr-only">
            Radar chart showing category proficiency averages across cloud, CI/CD, infrastructure as code, monitoring, and security categories.
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-soft"
            >
              {/* Category Name */}
              <h3 className="text-xl font-semibold mb-4 text-primary-600">
                {category.name}
              </h3>
              
              {/* Skills in this category */}
              <div className="grid grid-cols-2 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + categoryIndex * 0.1 + skillIndex * 0.05 
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary hover:bg-background transition-colors duration-200 group"
                    title={`${skill.years} years experience, ${skill.proficiency}/10 proficiency`}
                    aria-label={`${skill.name}, ${skill.years} years experience, ${skill.proficiency} out of 10 proficiency`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        {skill.icon.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {skill.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-border rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(skill.proficiency / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-foreground-muted">
                          {skill.proficiency}/10
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}