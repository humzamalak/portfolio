import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"],

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization for Cloudflare
  // Note: Cloudflare doesn't support Next.js automatic image optimization
  // Images will be served as-is or use Cloudflare Images (separate service)
  images: {
    unoptimized: true, // Required for Cloudflare Pages
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'humzamalak.dev',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "react-icons"],
  },

  // Headers are now handled via public/_headers file for Cloudflare Pages
  // Cloudflare Pages uses _headers file instead of Next.js headers() function
};

export default nextConfig;
