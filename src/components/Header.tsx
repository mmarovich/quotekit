import Link from "next/link";
import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <FileText className="h-5 w-5" />
          </span>
          QuoteKit
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#features" className="transition hover:text-brand-600">
            Features
          </Link>
          <Link href="/pricing" className="transition hover:text-brand-600">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/builder" className="btn-primary text-sm">
            Create Quote
          </Link>
        </div>
      </div>
    </header>
  );
}