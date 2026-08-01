import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Free Contractor Estimate Template — PDF Quote Builder",
  description:
    "Free contractor estimate template with line items, labor, materials, and tax. Build a professional PDF estimate for your client in minutes.",
};

export default function ContractorEstimatePage() {
  return (
    <SeoPage
      title="Free Contractor Estimate Template"
      subtitle="Build itemized estimates for construction, trades, and home services — then download a PDF your client can approve."
      bullets={[
        "Separate labor and materials on individual line items",
        "Add project title, quote number, and expiration date",
        "Include notes for scope, warranty, or payment terms",
        "Professional layout that builds trust with homeowners",
      ]}
    >
      <h2>What should a contractor estimate include?</h2>
      <p>
        A strong estimate lists every charge clearly: labor hours, materials,
        permits, disposal fees, and any optional upgrades. Clients approve faster
        when they can see exactly what they&apos;re paying for — not a single
        lump-sum number with no breakdown.
      </p>

      <h2>Quote vs. estimate — what&apos;s the difference?</h2>
      <p>
        In practice, contractors use the terms interchangeably. Both are pre-work
        documents that outline scope and price. QuoteKit lets you label the
        project, set a &quot;valid until&quot; date, and send a PDF before you
        schedule the job.
      </p>

      <h2>Tip: win more bids with professional presentation</h2>
      <p>
        Homeowners often collect 3 quotes before hiring. The clearest, most
        professional estimate — not always the cheapest — wins. A clean PDF with
        your business name, itemized pricing, and clear terms signals that
        you&apos;re organized and reliable.
      </p>
    </SeoPage>
  );
}