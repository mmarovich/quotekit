import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-display text-lg font-bold text-slate-900">QuoteKit</p>
            <p className="mt-1 text-sm text-slate-500">
              Professional quotes in minutes. Free to start.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 sm:justify-end">
            <Link href="/builder" className="hover:text-brand-600">
              Quote Builder
            </Link>
            <Link href="/free-quote-generator" className="hover:text-brand-600">
              Free Quote Generator
            </Link>
            <Link href="/contractor-estimate-template" className="hover:text-brand-600">
              Contractor Estimates
            </Link>
            <Link href="/pricing" className="hover:text-brand-600">
              Pricing
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} QuoteKit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}