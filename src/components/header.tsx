"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span>Humza Malak</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/#about"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            About
          </Link>
          <Link
            href="/#experience"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Experience
          </Link>
          <Link
            href="/#skills"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Skills
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Contact
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Blog
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background-secondary p-2 text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 md:hidden"
            aria-label="Open menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
