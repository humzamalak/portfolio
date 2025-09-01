import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Humza Malak - Full Stack Developer Portfolio",
  description: "Senior Full Stack Developer specializing in React, Node.js, and cloud technologies. Building scalable web applications with modern technologies.",
  keywords: ["Full Stack Developer", "React", "Node.js", "TypeScript", "Cloud", "DevOps"],
  authors: [{ name: "Humza Malak" }],
  creator: "Humza Malak",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humzamalak.com",
    title: "Humza Malak - Full Stack Developer Portfolio",
    description: "Senior Full Stack Developer specializing in React, Node.js, and cloud technologies.",
    siteName: "Humza Malak Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humza Malak - Full Stack Developer Portfolio",
    description: "Senior Full Stack Developer specializing in React, Node.js, and cloud technologies.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
