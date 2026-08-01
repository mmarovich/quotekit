import type { LineItem } from "./types";

export function lineTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function taxAmount(items: LineItem[], taxRate: number): number {
  return subtotal(items) * (taxRate / 100);
}

export function grandTotal(items: LineItem[], taxRate: number): number {
  return subtotal(items) + taxAmount(items, taxRate);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}