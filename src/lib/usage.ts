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

export function getQuotesRemaining(): number {
  const usage = getUsage();
  return Math.max(0, FREE_QUOTE_LIMIT - usage.count);
}

export function canExportQuote(): boolean {
  return getQuotesRemaining() > 0;
}

export function recordQuoteExport(): void {
  const usage = getUsage();
  const updated: UsageData = {
    count: usage.count + 1,
    month: currentMonth(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export const FREE_LIMIT = FREE_QUOTE_LIMIT;