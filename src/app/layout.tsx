import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsWrapper } from "@/components/analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://humzamalak.dev'),
  title: "Humza Malak - DevOps Engineer Portfolio",
  description: "Senior DevOps Engineer specializing in Kubernetes, AWS, Terraform, and CI/CD automation. Building scalable, secure cloud infrastructure with modern DevOps practices.",
  keywords: ["DevOps Engineer", "Kubernetes", "AWS", "Terraform", "CI/CD", "Infrastructure as Code", "Cloud Automation", "Microservices", "Jenkins", "Docker"],
  authors: [{ name: "Humza Malak" }],
  creator: "Humza Malak",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humzamalak.dev",
    title: "Humza Malak - DevOps Engineer Portfolio",
    description: "Senior DevOps Engineer specializing in Kubernetes, AWS, Terraform, and CI/CD automation. Building scalable, secure cloud infrastructure.",
    siteName: "Humza Malak DevOps Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Humza Malak - DevOps Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Humza Malak - DevOps Engineer Portfolio",
    description: "Senior DevOps Engineer specializing in Kubernetes, AWS, Terraform, and CI/CD automation.",
    creator: "@humzamalak",
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
  alternates: {
    canonical: "https://humzamalak.dev",
  },
};

// Structured data constants to ensure consistency
const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Humza Malak",
  jobTitle: "Senior DevOps Engineer",
  description: "Senior DevOps Engineer specializing in Kubernetes, AWS, Terraform, and CI/CD automation. Building scalable, secure cloud infrastructure.",
  url: "https://humzamalak.dev",
  sameAs: [
    "https://github.com/humzamalak",
    "https://www.linkedin.com/in/humza-m-64607514b/",
  ],
  knowsAbout: [
    "Kubernetes", "AWS", "Terraform", "CI/CD", "Infrastructure as Code",
    "Docker", "Jenkins", "GitLab CI", "GitHub Actions", "Helm",
    "Prometheus", "Grafana", "ELK Stack", "HashiCorp Vault", "Ansible"
  ],
  worksFor: {
    "@type": "Organization",
    name: "Freelance/Contract"
  }
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Humza Malak DevOps Portfolio",
  description: "Senior DevOps Engineer Portfolio",
  url: "https://humzamalak.dev",
  author: {
    "@type": "Person",
    name: "Humza Malak"
  }
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
        
        {/* Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(PERSON_SCHEMA)
          }}
        />
        
        {/* Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_SCHEMA)
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AnalyticsWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
