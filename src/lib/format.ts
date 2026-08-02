/** Digits-only helper. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Format US phone numbers for display/PDF.
 * 10 digits → (603) 439-1948
 * 11 digits starting with 1 → +1 (603) 439-1948
 * Otherwise leave the user's original text (international / extensions).
 */
export function formatPhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const digits = digitsOnly(trimmed);
  // Keep extension if present after x / ext
  const extMatch = trimmed.match(/(?:ext\.?|x)\s*[:.]?\s*(\d+)\s*$/i);
  const ext = extMatch ? ` ext. ${extMatch[1]}` : "";

  // Strip extension digits from the main number for formatting
  let mainDigits = digits;
  if (extMatch && digits.length > 10) {
    const extDigits = extMatch[1];
    if (digits.endsWith(extDigits)) {
      mainDigits = digits.slice(0, digits.length - extDigits.length);
    }
  }

  if (mainDigits.length === 10) {
    return `(${mainDigits.slice(0, 3)}) ${mainDigits.slice(3, 6)}-${mainDigits.slice(6)}${ext}`;
  }

  if (mainDigits.length === 11 && mainDigits.startsWith("1")) {
    return `+1 (${mainDigits.slice(1, 4)}) ${mainDigits.slice(4, 7)}-${mainDigits.slice(7)}${ext}`;
  }

  return trimmed;
}

/** Display dates as "Aug 2, 2026" instead of ISO. */
export function formatDisplayDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "—";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Helvetica (built into jsPDF) can't draw most Unicode.
 * Normalize common punctuation so quotes don't show as blank boxes.
 */
export function sanitizePdfText(value: string): string {
  return value
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\u2022/g, "*")
    .replace(/\t/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

/** Safe PDF filename from quote number. */
export function safeFilename(quoteNumber: string): string {
  const cleaned = quoteNumber
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || `quote-${Date.now().toString().slice(-6)}`;
}

/** Parse number inputs without NaN; clamp to a range. */
export function parseClampedNumber(
  raw: string,
  opts: { min?: number; max?: number; fallback?: number } = {}
): number {
  const { min = -Infinity, max = Infinity, fallback = 0 } = opts;
  if (raw.trim() === "" || raw === "-" || raw === ".") return fallback;
  // Strip currency symbols people paste from elsewhere
  const cleaned = raw.replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Round money to cents to avoid 0.1 * 3 = 0.30000000004 display bugs. */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
