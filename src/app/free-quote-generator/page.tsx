import type { Metadata } from "next";
import { SeoPage } from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Free Quote Generator — Create Professional Quotes Online",
  description:
    "Free online quote generator for freelancers and small businesses. Add line items, calculate tax, and download a professional PDF quote in minutes. No signup required.",
};

export default function FreeQuoteGeneratorPage() {
  return (
    <SeoPage
      title="Free Quote Generator"
      subtitle="Create and download professional quotes online — free, fast, and no account required."
      bullets={[
        "Itemized line items with quantities and unit prices",
        "Automatic subtotal, tax, and total calculations",
        "Instant PDF download you can email to clients",
        "Works for freelancers, contractors, and agencies",
      ]}
    >
      <h2>Why use a quote generator instead of Word or Excel?</h2>
      <p>
        Most small business owners waste time fighting with Word templates or
        messy spreadsheets. A purpose-built quote generator handles the math,
        formats everything consistently, and produces a client-ready PDF in one
        click.
      </p>
      <p>
        QuoteKit is built for service businesses that send quotes regularly but
        don&apos;t need expensive invoicing software. You fill in your business
        details once per quote, add line items, and download a polished document
        your client can approve.
      </p>

      <h2>Who is this for?</h2>
      <p>
        QuoteKit works well for plumbers, electricians, cleaners, landscapers,
        photographers, web designers, consultants, and any freelancer who needs to
        send a professional price estimate before starting work.
      </p>

      <h2>How much does it cost?</h2>
      <p>
        The quote builder is free for 3 PDF exports per month. If you send quotes
        every week, the Pro plan at $19/month gives you unlimited exports and
        custom branding.
      </p>
    </SeoPage>
  );
}