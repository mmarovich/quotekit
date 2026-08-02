const STORAGE_KEY = "quotekit_usage";
const FREE_QUOTE_LIMIT = 3;

interface UsageData {
  count: number;
  month: string;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

function getUsage(): UsageData {
  if (typeof window === "undefined") {
    return { count: 0, month: currentMonth() };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, month: currentMonth() };

    const data = JSON.parse(raw) as UsageData;
    if (data.month !== currentMonth()) {
      return { count: 0, month: currentMonth() };
    }
    return data;
  } catch {
    return { count: 0, month: currentMonth() };
  }
}

/** Owner/testing: wipe the free-tier counter for this browser. */
export function resetUsage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getQuotesRemaining(): number {
  const usage = getUsage();
  return Math.max(0, FREE_QUOTE_LIMIT - usage.count);
}

export function canExportQuote(isPro: boolean): boolean {
  if (isPro) return true;
  return getQuotesRemaining() > 0;
}

export function recordQuoteExport(isPro: boolean): void {
  if (isPro) return;
  const usage = getUsage();
  const updated: UsageData = {
    count: usage.count + 1,
    month: currentMonth(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** Ask the server if this browser has an active Stripe subscription. */
export async function fetchProStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/pro-status", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { pro?: boolean };
    return data.pro === true;
  } catch {
    return false;
  }
}

export const FREE_LIMIT = FREE_QUOTE_LIMIT;
