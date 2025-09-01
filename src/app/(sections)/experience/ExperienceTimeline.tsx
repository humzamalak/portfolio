"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/data/experience";
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaChartLine,
  FaCode,
  FaStar,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useState } from "react";

interface TimelineItemProps {
  role: typeof experience[0];
  index: number;
}

const TimelineItem = ({ role, index }: TimelineItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears === 1 ? '1 year' : `${diffYears} years`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border md:left-1/2 md:transform md:-translate-x-1/2" />
      
      {/* Timeline dot */}
      <div className="absolute left-4 top-6 w-4 h-4 bg-primary-500 rounded-full border-4 border-background md:left-1/2 md:transform md:-translate-x-1/2" />
      
      {/* Content card */}
      <div className="ml-16 md:ml-0 md:w-5/12 md:mb-8">
        {/* Alternate sides on desktop */}
        <div className={`md:${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} md:${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-background-secondary rounded-lg p-6 shadow-lg border border-border hover:border-primary-500 transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FaBuilding className="text-primary-400 text-lg" />
                  <h3 className="text-xl font-bold text-foreground">{role.company}</h3>
                </div>
                <h4 className="text-lg font-semibold text-primary-300 mb-2">{role.role}</h4>
                
                {/* Location and Duration */}
                <div className="flex items-center gap-4 text-sm text-foreground-muted mb-3">
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-foreground-muted" />
                    <span>{role.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-foreground-muted" />
                    <span>
                      {formatDate(role.startDate)} - {role.current ? 'Present' : formatDate(role.endDate!)}
                    </span>
                    <span className="text-foreground-muted">({formatDuration(role.startDate, role.endDate)})</span>
                  </div>
                </div>
              </div>
              
              {/* Expand/Collapse button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-4 p-2 text-foreground-muted hover:text-foreground transition-colors"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Description */}
            <p className="text-foreground mb-4 leading-relaxed">{role.description}</p>

            {/* Tech Stack */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-foreground-muted mb-2 flex items-center gap-2">
                <FaCode />
                Tech Stack
              </h5>
              <div className="flex flex-wrap gap-2">
                {role.techStack.map((tech, techIndex) => (
                  <motion.span
                    key={techIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: (index * 0.2) + (techIndex * 0.1) }}
                    className="px-3 py-1 bg-background-tertiary text-foreground text-sm rounded-full border border-border hover:border-primary-500 transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Expandable Content */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Metrics */}
              <div className="mb-4 pt-4 border-t border-border">
                <h5 className="text-sm font-semibold text-foreground-muted mb-3 flex items-center gap-2">
                  <FaChartLine />
                  Key Metrics & Achievements
                </h5>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {role.metrics.map((metric, metricIndex) => (
                    <motion.div
                      key={metricIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: metricIndex * 0.1 }}
                      className="bg-background-tertiary p-3 rounded-lg border border-border"
                    >
                      <div className="text-2xl font-bold text-primary-400">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-xs text-foreground-muted">{metric.label}</div>
                      {metric.improvement && (
                        <div className="text-xs text-secondary-400 mt-1">{metric.improvement}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-foreground-muted mb-3 flex items-center gap-2">
                  <FaStar />
                  Key Achievements
                </h5>
                <ul className="space-y-2">
                  {role.achievements.map((achievement, achievementIndex) => (
                    <motion.li
                      key={achievementIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: achievementIndex * 0.1 }}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary-400 mt-1">•</span>
                      <span>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Highlights */}
              <div>
                <h5 className="text-sm font-semibold text-foreground-muted mb-3">Highlights</h5>
                <div className="flex flex-wrap gap-2">
                  {role.highlights.map((highlight, highlightIndex) => (
                    <motion.span
                      key={highlightIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isExpanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: highlightIndex * 0.1 }}
                      className="px-2 py-1 bg-primary-900/30 text-primary-300 text-xs rounded border border-primary-700/50"
                    >
                      {highlight}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="w-full bg-background text-foreground py-16 px-4"
      aria-label="Professional Experience Timeline"
    >
      <div className="max-w-6xl mx-auto flex flex-col">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Professional Experience
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2" />
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {experience.map((role, index) => (
              <TimelineItem
                key={role.id}
                role={role}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
