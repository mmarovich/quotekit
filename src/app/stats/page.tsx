import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Stats — How to see usage",
  robots: { index: false, follow: false },
};

export default function StatsPage() {
  const hasGa = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Usage stats
          </h1>
          <p className="text-slate-600">
            Where to see if anyone is actually using QuoteKit
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            1. Vercel Analytics (page views)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Built into the site. Shows visitors, page views, and top pages — free
            on Vercel Hobby.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Open{" "}
              <a
                href="https://vercel.com/dashboard"
                className="font-medium text-brand-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                vercel.com/dashboard
              </a>
            </li>
            <li>Click your <strong>quotekit</strong> project</li>
            <li>
              Open the <strong>Analytics</strong> tab
            </li>
            <li>
              If it says Analytics is off: click <strong>Enable</strong> (Web
              Analytics, free)
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            PDF downloads also fire a custom event named{" "}
            <code className="rounded bg-slate-100 px-1">pdf_export</code> when
            custom events are available on your plan.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Google Analytics 4 (optional, free, more detail)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Better for &quot;how many people, which pages, PDF downloads over
            time.&quot;
          </p>
          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            Status:{" "}
            {hasGa ? (
              <span className="font-semibold text-green-700">
                Connected ({process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID})
              </span>
            ) : (
              <span className="font-semibold text-amber-700">
                Not set yet — see ANALYTICS.md
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            After setup, open{" "}
            <a
              href="https://analytics.google.com"
              className="font-medium text-brand-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              analytics.google.com
            </a>{" "}
            → Reports → Engagement → Events. Look for{" "}
            <code className="rounded bg-slate-100 px-1">pdf_export</code>.
          </p>
        </section>

        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900">
            What the numbers mean
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <strong>Visitors / page views</strong> — people opened the site
            </li>
            <li>
              <strong>/builder</strong> views — people tried the tool
            </li>
            <li>
              <strong>pdf_export</strong> events — someone actually downloaded a
              quote (the real usage signal)
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            Early days: expect zeros. That&apos;s normal until you share the link
            or Google finds the SEO pages.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/builder" className="btn-primary">
          Open builder
        </Link>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Vercel dashboard
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
