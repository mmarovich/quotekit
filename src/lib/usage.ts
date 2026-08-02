/**
 * Free forever mode: no export caps.
 * Local usage helpers kept only for optional personal stats display.
 */

const STORAGE_KEY = "quotekit_usage";

interface UsageData {
  count: number;
  month: string;
  lifetime: number;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

function getUsage(): UsageData {
  if (typeof window === "undefined") {
    return { count: 0, month: currentMonth(), lifetime: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: currentMonth(), lifetime: 0 };

    const data = JSON.parse(raw) as Partial<UsageData>;
    const month = data.month === currentMonth() ? data.month : currentMonth();
    const count = data.month === currentMonth() ? (data.count ?? 0) : 0;
    return {
      count,
      month,
      lifetime: data.lifetime ?? data.count ?? 0,
    };
  } catch {
    return { count: 0, month: currentMonth(), lifetime: 0 };
  }
}

/** How many PDFs this browser has exported this month (personal only). */
export function getLocalExportCount(): number {
  return getUsage().count;
}

export function getLocalLifetimeExports(): number {
  return getUsage().lifetime;
}

/** Always allowed — product is free forever. */
export function canExportQuote(): boolean {
  return true;
}

/** Record a successful export in this browser only (not site-wide). */
export function recordLocalExport(): void {
  if (typeof window === "undefined") return;
  const usage = getUsage();
  const updated: UsageData = {
    count: usage.count + 1,
    month: currentMonth(),
    lifetime: usage.lifetime + 1,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function resetUsage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** @deprecated Free forever — always true for “pro” features we used to gate. */
export async function fetchProStatus(): Promise<boolean> {
  return true;
}
