import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/stripe";
import { hasActiveProSubscription } from "@/lib/pro";

export async function GET() {
  if (!isStripeConfigured()) {
    return NextResponse.json({
      pro: false,
      configured: false,
    });
  }

  const status = await hasActiveProSubscription();
  return NextResponse.json({
    pro: status.pro,
    configured: true,
    customerId: status.customerId,
  });
}
