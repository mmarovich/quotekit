import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { UpgradeButton } from "@/components/UpgradeButton";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { isStripeConfigured } from "@/lib/stripe";
import { hasActiveProSubscription } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "QuoteKit pricing — free quote builder with Pro upgrade for unlimited exports.",
};

export const dynamic = "force-dynamic";

const freeFeatures = [
  "3 PDF exports per month",
  "Unlimited line items",
  "Professional PDF layout",
  "No signup required",
  "Browser-based — data stays local",
];

const proFeatures = [
  "Unlimited PDF exports",
  "No QuoteKit footer on PDFs",
  "Everything in Free",
  "Cancel anytime via Stripe portal",
];

export default async function PricingPage() {
  const configured = isStripeConfigured();
  let isPro = false;
  if (configured) {
    try {
      const status = await hasActiveProSubscription();
      isPro = status.pro;
    } catch {
      isPro = false;
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-slate-900">
          Simple, honest pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Start free. Upgrade when quotes become part of your daily workflow.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="card flex flex-col">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Free</h2>
            <p className="mt-1 text-slate-600">For trying it out</p>
            <p className="mt-6">
              <span className="font-display text-4xl font-bold text-slate-900">
                $0
              </span>
              <span className="text-slate-500">/month</span>
            </p>
          </div>
          <ul className="mt-8 flex-1 space-y-3">
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
          <Link href="/builder" className="btn-secondary mt-8 w-full text-center">
            Get Started Free
          </Link>
        </div>

        <div className="card relative flex flex-col border-brand-300 ring-2 ring-brand-500/20">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
            {isPro ? "Your plan" : "Most Popular"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Pro</h2>
            <p className="mt-1 text-slate-600">
              For active freelancers & contractors
            </p>
            <p className="mt-6">
              <span className="font-display text-4xl font-bold text-slate-900">
                $19
              </span>
              <span className="text-slate-500">/month</span>
            </p>
          </div>
          <ul className="mt-8 flex-1 space-y-3">
            {proFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-slate-700"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {feature}
              </li>
            ))}
          </ul>

          {isPro ? (
            <>
              <p className="mt-8 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-800">
                You&apos;re on Pro — unlimited exports unlocked.
              </p>
              <ManageBillingButton />
            </>
          ) : configured ? (
            <UpgradeButton />
          ) : (
            <>
              <button
                type="button"
                disabled
                className="btn-primary mt-8 w-full cursor-not-allowed opacity-60"
              >
                Upgrade to Pro
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">
                Payments activate after Stripe setup (see STRIPE-SETUP.md)
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <h3 className="font-semibold text-slate-900">Why $19/month?</h3>
        <p className="mt-2 text-sm text-slate-600">
          One landed job from a professional quote pays for years of Pro. Built
          for people who send 5+ quotes a month and don&apos;t want a free-tier
          cap in the way.
        </p>
      </div>
    </div>
  );
}
