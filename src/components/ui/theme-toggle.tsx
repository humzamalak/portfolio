"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-lg border border-border bg-background-secondary p-2 text-foreground transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center justify-center rounded-lg border border-border bg-background-secondary p-2 text-foreground transition-all duration-200 hover:bg-background hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
      )}
      <span className="sr-only">
        Switch to {theme === "light" ? "dark" : "light"} theme
      </span>
    </button>
  );
}
