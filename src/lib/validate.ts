import type { QuoteData } from "./types";
import { formatPhone } from "./format";
import { grandTotal } from "./calculations";

export type FieldErrors = Partial<
  Record<
    | "businessName"
    | "businessEmail"
    | "businessPhone"
    | "clientName"
    | "clientEmail"
    | "quoteDate"
    | "validUntil"
    | "lineItems"
    | "form",
    string
  >
>;

/** Empty is OK (optional field). Non-empty must look like an email. */
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (!email) return true;
  // Practical check: one @, local + domain, domain has a dot, no spaces
  if (/\s/.test(email)) return false;
  if ((email.match(/@/g) || []).length !== 1) return false;
  const [local, domain] = email.split("@");
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (!domain.includes(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.includes("..")) return false;
  // Basic charset (no unicode domains for now — PDF font can't handle them well)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Empty OK. If provided, must have 10+ digits (US) or look intentional international. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  // International: at least 8 digits total, not a random 3–6 digit stub
  if (digits.length >= 8 && digits.length <= 15) return true;
  return false;
}

export function validateQuote(quote: QuoteData): FieldErrors {
  const errors: FieldErrors = {};

  if (!quote.businessName.trim()) {
    errors.businessName = "Business name is required.";
  } else if (quote.businessName.trim().length < 2) {
    errors.businessName = "Business name is too short.";
  }

  if (!quote.clientName.trim()) {
    errors.clientName = "Client name is required.";
  }

  if (quote.businessEmail.trim() && !isValidEmail(quote.businessEmail)) {
    errors.businessEmail =
      "Enter a valid email (must include @ and a domain, e.g. you@business.com).";
  }

  if (quote.clientEmail.trim() && !isValidEmail(quote.clientEmail)) {
    errors.clientEmail =
      "Enter a valid email (must include @ and a domain, e.g. client@email.com).";
  }

  if (quote.businessPhone.trim() && !isValidPhone(quote.businessPhone)) {
    errors.businessPhone =
      "Phone looks incomplete. Use 10 digits (e.g. 6034391948) or a full international number.";
  }

  if (!quote.quoteDate) {
    errors.quoteDate = "Quote date is required.";
  }

  if (!quote.validUntil) {
    errors.validUntil = "Valid-until date is required.";
  } else if (quote.quoteDate && quote.validUntil < quote.quoteDate) {
    errors.validUntil = "Valid-until date cannot be before the quote date.";
  }

  const hasPricedItem = quote.lineItems.some(
    (item) =>
      (Number.isFinite(item.quantity) ? item.quantity : 0) > 0 &&
      (Number.isFinite(item.unitPrice) ? item.unitPrice : 0) > 0
  );
  const hasDescription = quote.lineItems.some((item) => item.description.trim());

  if (!hasDescription && !hasPricedItem) {
    errors.lineItems =
      "Add at least one line item with a description and price.";
  } else if (!hasPricedItem) {
    errors.lineItems =
      "All line items are $0. Add a quantity and unit price before exporting.";
  } else if (!hasDescription) {
    errors.lineItems =
      "Add a description to your line items so the client knows what they're paying for.";
  }

  // Soft check: total is absurdly large (likely typo)
  const total = grandTotal(quote.lineItems, quote.taxRate);
  if (total > 50_000_000) {
    errors.form =
      "Total is over $50,000,000 — double-check quantities and prices for typos.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Normalize quote fields before PDF export. */
export function normalizeQuote(quote: QuoteData): QuoteData {
  return {
    ...quote,
    businessName: quote.businessName.trim(),
    businessEmail: normalizeEmail(quote.businessEmail),
    businessPhone: formatPhone(quote.businessPhone),
    businessAddress: quote.businessAddress.trim(),
    clientName: quote.clientName.trim(),
    clientEmail: normalizeEmail(quote.clientEmail),
    clientAddress: quote.clientAddress.trim(),
    quoteNumber: quote.quoteNumber.trim() || `Q-${Date.now().toString().slice(-6)}`,
    projectTitle: quote.projectTitle.trim(),
    notes: quote.notes.trim(),
    lineItems: quote.lineItems.map((item) => ({
      ...item,
      description: item.description.trim(),
    })),
  };
}
