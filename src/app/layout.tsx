import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://humzamalak.dev"),
  title: "Humza Malak — Platform & DevOps Engineer",
  description: "Humza Malak designs calm, observable cloud platforms and delivery systems.",
  authors: [{ name: "Humza Malak" }],
  openGraph: { type: "website", url: "https://humzamalak.dev", title: "Humza Malak — Platform & DevOps Engineer", description: "Cloud foundations, delivery systems, and platform reliability." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
