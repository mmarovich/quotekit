import { track } from "@vercel/analytics";

/** Fire when a user successfully downloads a PDF. */
export function trackPdfExport(): void {
  try {
    track("pdf_export");
  } catch {
    // Analytics must never break the product
  }

  // Google Analytics 4 (if configured)
  if (typeof window !== "undefined") {
    const w = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };
    w.gtag?.("event", "pdf_export", {
      event_category: "engagement",
      event_label: "quote_pdf",
    });
  }
}

export function trackPageHint(name: string): void {
  try {
    track(name);
  } catch {
    // no-op
  }
}
