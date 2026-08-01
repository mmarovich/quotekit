import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    "Create professional quotes and proposals in minutes. Free quote builder for freelancers, contractors, and small businesses. Download PDF instantly.",
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
      "Create professional quotes in minutes. Free to start, no signup required.",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}