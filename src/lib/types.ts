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

export const DEFAULT_QUOTE = (): QuoteData => ({
  businessName: "",
  businessEmail: "",
  businessPhone: "",
  businessAddress: "",
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  quoteNumber: `Q-${Date.now().toString().slice(-6)}`,
  quoteDate: new Date().toISOString().split("T")[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  projectTitle: "",
  notes: "",
  taxRate: 0,
  lineItems: [EMPTY_LINE_ITEM()],
});