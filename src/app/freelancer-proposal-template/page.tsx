import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Free Freelancer Proposal Template — PDF Quote Maker",
  description:
    "Free freelancer proposal template with scoped line items and professional PDF export. Perfect for designers, developers, writers, and consultants.",
};

export default function FreelancerProposalPage() {
  return (
    <SeoPage
      title="Free Freelancer Proposal Template"
      subtitle="Scope the project, price each deliverable, and send a polished proposal PDF — without wrestling with Google Docs."
      bullets={[
        "Break projects into deliverables with individual prices",
        "Add project title and proposal validity date",
        "Include scope notes and payment terms",
        "Download and send in minutes — no account needed",
      ]}
    >
      <h2>How freelancers should structure a proposal</h2>
      <p>
        Clients hire freelancers who make the scope crystal clear. Instead of
        &quot;website redesign — $3,000,&quot; break it down: discovery, wireframes,
        design, development, revisions, and launch support. Each line item shows
        the client what they&apos;re buying and protects you from scope creep.
      </p>

      <h2>When to send a proposal vs. a quick email quote</h2>
      <p>
        For small tasks under $500, a quick email might be enough. For anything
        over $1,000 — or projects with multiple phases — a formal proposal PDF
        sets expectations and makes you look established, even if you&apos;re a
        solo freelancer.
      </p>

      <h2>Free to start</h2>
      <p>
        QuoteKit gives you 3 free PDF exports per month. That&apos;s enough to land
        your next client. When proposals become part of your weekly routine,
        upgrade to Pro for unlimited exports.
      </p>
    </SeoPage>
  );
}