import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { setProCustomerCookie } from "@/lib/pro-cookie";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured." },
      { status: 503 }
    );
  }

  let sessionId: string | undefined;
  try {
    const body = (await req.json()) as { session_id?: string };
    sessionId = body.session_id;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json(
        { error: "Payment not completed yet.", pro: false },
        { status: 402 }
      );
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    if (!customerId) {
      return NextResponse.json(
        { error: "No customer on this session." },
        { status: 400 }
      );
    }

    await setProCustomerCookie(customerId);

    return NextResponse.json({
      pro: true,
      customerId,
      email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not confirm payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
