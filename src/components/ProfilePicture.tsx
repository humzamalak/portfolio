"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: number;
}

export default function ProfilePicture({
  src = "/humza-headshot-optimized.jpg",
  alt = "Profile picture",
  size = 160,
}: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageError = () => {
    if (!imageError) {
      // Try fallback to original image
      setCurrentSrc("/humza-headshot.jpg");
      setImageError(true);
    } else {
      // If both fail, show placeholder
      setCurrentSrc("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23e5e7eb'/%3E%3Ctext x='80' y='80' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
      aria-label="Profile picture"
    >
      <Image
        src={currentSrc}
        alt={alt}
        width={size}
        height={size}
        className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-primary-500 shadow-soft-lg mx-auto"
        priority
        unoptimized={currentSrc.startsWith('/') && currentSrc.includes('humza-headshot')}
        onError={handleImageError}
      />
      <div className="absolute inset-0 rounded-full border-4 border-secondary-500 opacity-20 animate-pulse" />
    </motion.div>
  );
}


