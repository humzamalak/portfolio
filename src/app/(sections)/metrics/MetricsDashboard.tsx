"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { 
  FaServer, 
  FaRocket, 
  FaClock, 
  FaDollarSign
} from "react-icons/fa";

import {
  kpiMetrics,
  responsibilityGrowth,
  techAdoptionTimeline,
  toolUsageBreakdown,
  type KPIMetric,
} from "@/data/metrics";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart.js configuration for dark theme
const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#ffffff",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#9ca3af",
      },
      grid: {
        color: "#374151",
      },
    },
    y: {
      ticks: {
        color: "#9ca3af",
      },
      grid: {
        color: "#374151",
      },
    },
  },
};

// Animated Counter Component
const AnimatedCounter = ({ 
  value, 
  prefix = "", 
  suffix = "", 
  duration = 2 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  duration?: number; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(value * easeOutQuart));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      animate();
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="text-3xl font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// KPI Card Component
const KPICard = ({ metric }: { metric: KPIMetric }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getIcon = (iconName: string) => {
    const icons = {
      Server: FaServer,
      Rocket: FaRocket,
      Clock: FaClock,
      DollarSign: FaDollarSign,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || FaServer;
    return <IconComponent className="w-8 h-8 text-blue-400" />;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-neutral-800 p-6 shadow-md flex flex-col items-center gap-4 hover:bg-neutral-700 transition-colors"
      aria-label={`${metric.value}${metric.suffix || ""} ${metric.label.toLowerCase()} achieved`}
    >
      {getIcon(metric.icon)}
      <div className="text-center">
        <AnimatedCounter
          value={metric.value}
          prefix={metric.prefix}
          suffix={metric.suffix}
        />
        <p className="text-neutral-400 text-sm mt-2">{metric.label}</p>
      </div>
    </motion.div>
  );
};

// Chart Components
const ResponsibilityGrowthChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const data = {
    labels: responsibilityGrowth.map(item => item.level),
    datasets: [
      {
        label: "Responsibilities",
        data: responsibilityGrowth.map(item => item.responsibilities),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full md:w-1/2"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Responsibility Growth</h3>
      <div className="h-64">
        <Bar data={data} options={chartConfig} />
      </div>
    </motion.div>
  );
};

const TechAdoptionChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const data = {
    labels: techAdoptionTimeline.map(item => item.year.toString()),
    datasets: [
      {
        label: "Tools Adopted",
        data: techAdoptionTimeline.map(item => item.cumulative),
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="w-full md:w-1/2"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Tech Adoption Timeline</h3>
      <div className="h-64">
        <Line data={data} options={chartConfig} />
      </div>
    </motion.div>
  );
};

const ToolUsageChart = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const data = {
    labels: toolUsageBreakdown.map(item => item.category),
    datasets: [
      {
        data: toolUsageBreakdown.map(item => item.percentage),
        backgroundColor: toolUsageBreakdown.map(item => item.color),
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...chartConfig,
    plugins: {
      ...chartConfig.plugins,
      legend: {
        ...chartConfig.plugins.legend,
        position: "bottom" as const,
      },
    },
    cutout: "60%",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full md:w-1/2"
    >
      <h3 className="text-xl font-semibold mb-4 text-center">Tool Usage Split</h3>
      <div className="h-64 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-neutral-400">DevOps Focus</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function MetricsDashboard() {
  return (
    <section
      id="metrics"
      className="w-full bg-neutral-950 text-white py-16 px-4"
      aria-label="Interactive Metrics Dashboard"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Interactive Metrics Dashboard
        </motion.h2>

        {/* KPI Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {kpiMetrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <ResponsibilityGrowthChart />
          <TechAdoptionChart />
        </motion.div>

        {/* Tool Usage Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <ToolUsageChart />
        </motion.div>
      </div>
    </section>
  );
}
