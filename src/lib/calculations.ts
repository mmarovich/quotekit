import type { LineItem } from "./types";
import { roundMoney } from "./format";

export function lineTotal(item: LineItem): number {
  const qty = Number.isFinite(item.quantity) ? item.quantity : 0;
  const price = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
  return roundMoney(qty * price);
}

export function subtotal(items: LineItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + lineTotal(item), 0));
}

export function taxAmount(items: LineItem[], taxRate: number): number {
  const rate = Number.isFinite(taxRate) ? Math.max(0, Math.min(100, taxRate)) : 0;
  return roundMoney(subtotal(items) * (rate / 100));
}

export function grandTotal(items: LineItem[], taxRate: number): number {
  return roundMoney(subtotal(items) + taxAmount(items, taxRate));
}

export function formatCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(safe);
}
