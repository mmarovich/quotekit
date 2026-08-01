import Link from "next/link";
import {
  FileText,
  Download,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Ready in 5 minutes",
    description:
      "No account needed. Fill in your details, add line items, and download a polished PDF.",
  },
  {
    icon: FileText,
    title: "Professional layout",
    description:
      "Clean, client-ready quotes with your branding, itemized pricing, and terms.",
  },
  {
    icon: Download,
    title: "Instant PDF export",
    description:
      "Download and email your quote immediately. No watermarks on the free tier.",
  },
  {
    icon: Shield,
    title: "Your data stays local",
    description:
      "Quotes are built in your browser. Nothing is stored on our servers.",
  },
];

const steps = [
  "Enter your business and client info",
  "Add line items with quantities and prices",
  "Download a professional PDF quote",
];

const audiences = [
  "Freelancers & consultants",
  "Contractors & tradespeople",
  "Agencies & studios",
  "Cleaning & landscaping services",
  "Photographers & creatives",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Zap className="h-4 w-4" />
              Free quote generator — no signup required
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Win more jobs with{" "}
              <span className="text-brand-600">professional quotes</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              QuoteKit helps freelancers and contractors create polished quotes
              and proposals in minutes. Free to start — upgrade when you need
              unlimited exports and custom branding.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/builder" className="btn-primary px-8 py-3 text-base">
                Create Your First Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/pricing" className="btn-secondary px-8 py-3 text-base">
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              3 free PDF exports per month · No credit card required
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Everything you need to quote with confidence
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Built for people who need to send quotes fast — not wrestle with
              Word templates or spreadsheets.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="card text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">
                How it works
              </h2>
              <p className="mt-4 text-slate-300">
                Three steps from blank page to client-ready quote.
              </p>
              <ul className="mt-8 space-y-4">
                {steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-slate-200">{step}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/builder"
                className="btn-primary mt-8 bg-white text-brand-700 hover:bg-brand-50"
              >
                Try it free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
              <p className="text-sm font-medium uppercase tracking-wide text-brand-400">
                Perfect for
              </p>
              <ul className="mt-6 space-y-3">
                {audiences.map((audience) => (
                  <li key={audience} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-400" />
                    <span className="text-slate-200">{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Stop losing jobs to sloppy quotes
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Clients judge your professionalism by how you present your price.
            QuoteKit makes you look like the pro you are — for free.
          </p>
          <Link href="/builder" className="btn-primary mt-8 px-8 py-3 text-base">
            Create a Quote Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}