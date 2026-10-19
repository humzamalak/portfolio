import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConsentBanner } from "@/components/consent";

const title = "Humza Malak — Platform & DevOps Engineer";
const description = "Humza Malak designs calm, observable cloud platforms and delivery systems.";
const socialDescription = "Cloud foundations, delivery systems, and platform reliability.";
const ogImage = { url: "/og-image.jpg", width: 1200, height: 630, alt: title };

export const metadata: Metadata = {
  metadataBase: new URL("https://humzamalak.dev"),
  title: { default: title, template: "%s | Humza Malak" },
  description,
  authors: [{ name: "Humza Malak" }],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  openGraph: { type: "website", url: "https://humzamalak.dev", siteName: "Humza Malak", locale: "en_GB", title, description: socialDescription, images: [ogImage] },
  twitter: { card: "summary_large_image", title, description: socialDescription, images: [ogImage.url] },
};

export const viewport: Viewport = { themeColor: "#f2f0ea" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
