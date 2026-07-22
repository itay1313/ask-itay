import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.siteName} — ${siteConfig.name}`,
    template: `%s — ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: [
    "Itay Haephrati",
    "Design Engineer",
    "Frontend Developer",
    "Creative Developer",
    "Design Systems",
    "React",
    "Next.js",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.siteName} — ${siteConfig.name}`,
    description: siteConfig.description,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName} — ${siteConfig.name}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  sameAs: [siteConfig.portfolio, siteConfig.linkedin],
  jobTitle: "Design Engineer / Creative Developer",
  knowsAbout: [
    "Frontend Development",
    "React",
    "Next.js",
    "TypeScript",
    "Design Systems",
    "UX/UI Design",
    "Figma",
    "AI & Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
