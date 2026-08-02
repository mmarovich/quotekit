import { NextResponse } from "next/server";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import { getProCustomerId } from "@/lib/pro-cookie";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 }
    );
  }

  const customerId = await getProCustomerId();
  if (!customerId) {
    return NextResponse.json(
      { error: "No subscription found in this browser. Upgrade first." },
      { status: 401 }
    );
  }

  try {
    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getSiteUrl()}/pricing`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not open billing portal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
