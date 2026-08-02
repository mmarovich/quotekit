import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Bug, Lightbulb, MessageCircle, ArrowRight } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Contact QuoteKit for bug reports, feature requests, and questions. Free quote generator support.",
};

const topics = [
  {
    icon: Bug,
    title: "Bug reports",
    description:
      "Something broke or looks wrong? Tell me what you did, what you expected, and what happened (browser helps too).",
  },
  {
    icon: Lightbulb,
    title: "Feature ideas",
    description:
      "Missing a field, template, or workflow? I read every message — no promises, but good ideas get built.",
  },
  {
    icon: MessageCircle,
    title: "Questions",
    description:
      "Not sure how something works, or want to use QuoteKit for your business? Just ask.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-600">Support</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">
        Get in touch
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        QuoteKit is free and run by one person. Email is the best way to reach me
        for bugs, requests, or questions.
      </p>

      <div className="card mt-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Support email
        </h2>
        <a
          href={SUPPORT_MAILTO}
          className="mt-3 inline-block font-display text-xl font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
          I usually reply within a few days. Please include screenshots if
          you&apos;re reporting a PDF or layout issue.
        </p>
        <a href={SUPPORT_MAILTO} className="btn-primary mt-6">
          <Mail className="h-4 w-4" />
          Open email app
        </a>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {topics.map((topic) => (
          <div key={topic.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <topic.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{topic.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{topic.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/builder" className="btn-secondary">
          Back to quote builder
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
