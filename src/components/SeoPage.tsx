import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface SeoPageProps {
  title: string;
  subtitle: string;
  bullets: string[];
  children: React.ReactNode;
}

export function SeoPage({ title, subtitle, bullets, children }: SeoPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-600">QuoteKit — Free Tool</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{subtitle}</p>

      <ul className="mt-8 space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            {bullet}
          </li>
        ))}
      </ul>

      <Link href="/builder" className="btn-primary mt-10 px-8 py-3 text-base">
        Create Your Quote Free
        <ArrowRight className="h-5 w-5" />
      </Link>

      <div className="prose prose-slate mt-14 max-w-none">{children}</div>

      <div className="mt-14 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
        <p className="font-semibold text-brand-900">Ready in under 5 minutes</p>
        <p className="mt-1 text-sm text-brand-700">
          No signup. Add your line items, download a PDF, send it to your client.
        </p>
        <Link href="/builder" className="btn-primary mt-4">
          Open Quote Builder
        </Link>
      </div>
    </div>
  );
}