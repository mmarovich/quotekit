import { getStripe } from "./stripe";
import { getProCustomerId } from "./pro-cookie";

export async function hasActiveProSubscription(): Promise<{
  pro: boolean;
  customerId: string | null;
}> {
  const customerId = await getProCustomerId();
  if (!customerId) {
    return { pro: false, customerId: null };
  }

  try {
    const stripe = getStripe();
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    if (subs.data.length > 0) {
      return { pro: true, customerId };
    }

    // Also accept trialing
    const trialing = await stripe.subscriptions.list({
      customer: customerId,
      status: "trialing",
      limit: 1,
    });
    return { pro: trialing.data.length > 0, customerId };
  } catch {
    return { pro: false, customerId };
  }
}
