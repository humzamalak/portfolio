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

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    inquiryType: 'general'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isAvailable] = useState(true); // You can make this dynamic based on your availability

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'consulting', label: 'Consulting Work' },
    { value: 'freelance', label: 'Freelance Project' },
    { value: 'job', label: 'Job Opportunity' },
    { value: 'collaboration', label: 'Collaboration' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Track form submission for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'submit', {
        event_category: 'contact_form',
        event_label: 'portfolio_contact',
        value: 1
      });
    }

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          message: '',
          inquiryType: 'general'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const,
        type: "spring" as const,
        stiffness: 200
      } 
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section 
      id="contact" 
      className="w-full bg-background text-foreground py-16 px-4"
      aria-label="Contact Section"
    >
      <motion.div 
        className="max-w-3xl mx-auto flex flex-col gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Heading */}
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
        >
          Get In Touch
        </motion.h2>

        {/* Availability Badge */}
        <motion.div 
          variants={badgeVariants}
          className="flex justify-center"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isAvailable 
              ? 'bg-secondary-600 text-secondary-foreground' 
              : 'bg-red-600 text-red-foreground'
          }`}>
            {isAvailable ? (
              <>
                <FiCheck className="w-4 h-4" />
                Available for Consulting & Freelance Work
              </>
            ) : (
              <>
                <FiX className="w-4 h-4" />
                Currently Not Taking New Projects
              </>
            )}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          variants={itemVariants}
          className="bg-background-secondary rounded-2xl p-6 shadow-md"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-analytics="contact">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-md bg-background-tertiary border ${
                  errors.name ? 'border-red-500' : 'border-border'
                } text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-md bg-background-tertiary border ${
                  errors.email ? 'border-red-500' : 'border-border'
                } text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Inquiry Type Field */}
            <div>
              <label htmlFor="inquiryType" className="block text-sm font-medium mb-2 text-foreground">
                Inquiry Type
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md bg-background-tertiary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {inquiryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className={`w-full px-4 py-3 rounded-md bg-background-tertiary border ${
                  errors.message ? 'border-red-500' : 'border-border'
                } text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical`}
                placeholder="Tell me about your project or inquiry..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-foreground-muted cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-primary-foreground`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
                          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-secondary-600 text-secondary-foreground text-sm"
              role="status"
              aria-live="polite"
            >
                ✅ Your message has been sent! I&apos;ll get back to you soon.
              </motion.div>
            )}

            {submitStatus === 'error' && (
                          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-red-600 text-red-foreground text-sm"
              role="status"
              aria-live="polite"
            >
                ❌ Something went wrong. Please try again or reach out via email.
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center gap-6"
        >
          <motion.a
            href="https://github.com/humzamalak"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            custom={0}
            variants={socialVariants}
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-8 h-8 text-foreground-muted hover:text-primary-500 transition-colors"
          >
            <FaGithub className="w-full h-full" />
          </motion.a>
          
          <motion.a
            href="https://linkedin.com/in/humzamalak"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            custom={1}
            variants={socialVariants}
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-8 h-8 text-foreground-muted hover:text-primary-500 transition-colors"
          >
            <FaLinkedin className="w-full h-full" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
