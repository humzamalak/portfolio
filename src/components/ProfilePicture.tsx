"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: number;
}

export default function ProfilePicture({
  src = "/humza-headshot.jpg",
  alt = "Profile picture",
  size = 160,
}: ProfilePictureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
      aria-label="Profile picture"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-primary-500 shadow-soft-lg mx-auto"
        priority
      />
      <div className="absolute inset-0 rounded-full border-4 border-secondary-500 opacity-20 animate-pulse" />
    </motion.div>
  );
}


