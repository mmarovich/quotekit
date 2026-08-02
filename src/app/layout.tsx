import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "QuoteKit — Free Quote & Proposal Generator for Freelancers",
    template: "%s | QuoteKit",
  },
  description:
    "Free forever quote & proposal generator. Unlimited professional PDF quotes for freelancers, contractors, and small businesses. No signup.",
  keywords: [
    "free quote generator",
    "proposal builder",
    "quote template",
    "freelancer quote",
    "contractor estimate",
    "PDF quote maker",
  ],
  openGraph: {
    title: "QuoteKit — Free Quote & Proposal Generator",
    description:
      "Create professional quotes in minutes. Free forever, unlimited PDFs, no signup.",
    type: "website",
    siteName: "QuoteKit",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        <GoogleAnalytics />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}