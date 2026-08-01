import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/QuoteBuilder";

export const metadata: Metadata = {
  title: "Free Quote Builder",
  description:
    "Build and download professional quote PDFs for free. Perfect for freelancers, contractors, and small businesses.",
};

export default function BuilderPage() {
  return <QuoteBuilder />;
}