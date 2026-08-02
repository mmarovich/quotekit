export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;
  projectTitle: string;
  notes: string;
  taxRate: number;
  lineItems: LineItem[];
}

export const EMPTY_LINE_ITEM = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0,
});

/** Local calendar date as YYYY-MM-DD (not UTC — avoids "tomorrow" bugs in US timezones). */
function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function localDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

export const DEFAULT_QUOTE = (): QuoteData => ({
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  businessAddress: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  quoteNumber: `Q-${Date.now().toString().slice(-6)}`,
  quoteDate: localDateString(),
  validUntil: localDatePlusDays(30),
  projectTitle: "",
  notes: "",
  taxRate: 0,
  lineItems: [EMPTY_LINE_ITEM()],
});