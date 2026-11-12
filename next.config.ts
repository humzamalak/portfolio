import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// True when at least one field note is published. The nav and the home page hide
// "Field notes" until then, so the site never shows placeholder posts.
const notesDir = path.join(process.cwd(), "content", "notes");
const hasPublishedNotes = fs.existsSync(notesDir) && fs.readdirSync(notesDir).some(file => file.endsWith(".md") && !file.startsWith("_") && /^status:\s*["']?published["']?\s*$/m.test(fs.readFileSync(path.join(notesDir, file), "utf8")));

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_HAS_NOTES: hasPublishedNotes ? "1" : "0" },
};

export default nextConfig;
