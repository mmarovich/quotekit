import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PRO_COOKIE_NAME = "quotekit_customer";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 400; // ~13 months

function secret(): string {
  return (
    process.env.PRO_COOKIE_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "quotekit-dev-secret-change-me"
  );
}

export function signCustomerId(customerId: string): string {
  const sig = createHmac("sha256", secret())
    .update(customerId)
    .digest("base64url");
  return `${customerId}.${sig}`;
}

export function verifyCustomerCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  const [customerId, sig] = raw.split(".");
  if (!customerId || !sig) return null;
  const expected = createHmac("sha256", secret())
    .update(customerId)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  if (!customerId.startsWith("cus_")) return null;
  return customerId;
}

export async function setProCustomerCookie(customerId: string): Promise<void> {
  const jar = await cookies();
  jar.set(PRO_COOKIE_NAME, signCustomerId(customerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearProCustomerCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(PRO_COOKIE_NAME);
}

export async function getProCustomerId(): Promise<string | null> {
  const jar = await cookies();
  return verifyCustomerCookie(jar.get(PRO_COOKIE_NAME)?.value);
}
