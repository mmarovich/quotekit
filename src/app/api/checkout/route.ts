import { NextResponse } from "next/server";
import { getSiteUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import { getProCustomerId } from "@/lib/pro-cookie";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured yet. Add Stripe keys (see STRIPE-SETUP.md).",
      },
      { status: 503 }
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID!;
  const stripe = getStripe();
  const site = getSiteUrl();
  const existingCustomer = await getProCustomerId();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/pricing`,
      allow_promotion_codes: true,
      ...(existingCustomer ? { customer: existingCustomer } : {}),
      metadata: { product: "quotekit_pro" },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout failed. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
