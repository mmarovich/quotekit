import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Free Forever",
  description:
    "QuoteKit is 100% free. Unlimited professional quote PDFs, no signup, no credit card.",
};

const freeFeatures = [
  "Unlimited PDF exports",
  "No signup required",
  "Professional quote layout",
  "Line items, tax, notes",
  "Works in your browser — data stays local",
  "No credit card, ever",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Heart className="h-6 w-6" />
        </div>
        <h1 className="font-display text-4xl font-bold text-slate-900">
          Free. Forever.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          QuoteKit is a free quote generator for freelancers and contractors.
          No paid plan. No trial that expires. No limit on PDFs.
        </p>
      </div>

      <div className="card mx-auto mt-12 max-w-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Everything</h2>
          <p className="mt-6">
            <span className="font-display text-5xl font-bold text-slate-900">
              $0
            </span>
            <span className="text-slate-500">/forever</span>
          </p>
        </div>
        <ul className="mt-8 space-y-3">
          {freeFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-slate-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {feature}
            </li>
          ))}
        </ul>
        <Link href="/builder" className="btn-primary mt-8 w-full text-center">
          Create a free quote
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <p className="mx-auto mt-10 max-w-lg text-center text-sm text-slate-500">
        We keep the lights on with free hosting. If QuoteKit helps you win a
        job, that&apos;s the win. Bugs or ideas?{" "}
        <Link href="/contact" className="font-medium text-brand-600 hover:underline">
          Contact support
        </Link>
        .
      </p>
    </div>
  );
}
