# Stripe setup (idiot-proof) — do this BEFORE marketing

You only do the Stripe dashboard + Vercel keys. Code is already built.

**Time:** ~20 minutes  
**Cost:** $0 until someone pays you (Stripe takes ~2.9% + 30¢ per charge)

---

## What you're enabling

- **Upgrade to Pro** → Stripe Checkout → $19/month subscription  
- After pay → browser is unlocked for **unlimited PDF exports**  
- **Manage billing** → cancel/update card in Stripe's portal  

---

## Step 1 — Create a Stripe account

1. Go to https://dashboard.stripe.com/register  
2. Sign up (business type can be "Individual" / freelancer)  
3. Skip as much "activate payments" as you want for **test mode** first  

Top-right: make sure it says **Test mode** (orange banner) while testing.

---

## Step 2 — Create the Pro product ($19/month)

1. Left sidebar → **Product catalog** → **Add product**  
2. Name: `QuoteKit Pro`  
3. Description: `Unlimited quote PDF exports`  
4. Pricing model: **Recurring**  
5. Price: `19` USD  
6. Billing period: **Monthly**  
7. Click **Save product**  

8. On the product page, find the **Price ID** — it looks like `price_1ABC...`  
9. **Copy that Price ID** (you need it in Step 4)

---

## Step 3 — Copy your Secret API key

1. Developers → **API keys**  
2. Under **Secret key**, click **Reveal**  
3. Copy the key starting with `sk_test_...`  
   - Never share this publicly  
   - Never put it in a Reddit post  

---

## Step 4 — Add keys on Vercel

1. Go to https://vercel.com → your **quotekit** project  
2. **Settings** → **Environment Variables**  
3. Add these **one by one** (Environment: Production + Preview + Development):

| Name | Value |
|------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (from Step 3) |
| `STRIPE_PRICE_ID` | `price_...` (from Step 2) |
| `NEXT_PUBLIC_SITE_URL` | `https://quotekit-silk.vercel.app` |
| `PRO_COOKIE_SECRET` | any long random string (e.g. mash keyboard 40 chars) |

4. **Deployments** → open latest → **⋯** → **Redeploy**  
   (or push any commit — env vars apply on next deploy)

---

## Step 5 — Turn on Customer Portal (for cancel/manage)

1. Stripe Dashboard → **Settings** → **Billing** → **Customer portal**  
2. Click **Activate** / enable the portal  
3. Allow customers to: cancel subscription, update payment method  
4. Save  

---

## Step 6 — Test a fake payment

1. Open https://quotekit-silk.vercel.app/pricing  
2. Click **Upgrade to Pro**  
3. Use Stripe test card:  
   - Card: `4242 4242 4242 4242`  
   - Expiry: any future date  
   - CVC: any 3 digits  
   - ZIP: any  
4. Complete checkout  
5. You should land on **You're on Pro**  
6. Open **Builder** — badge should say **Pro — unlimited exports**  
7. Download more than 3 PDFs — should work with no paywall  

---

## Step 7 — Go live (when ready for real money)

1. Stripe: complete **Activate your account** (identity + bank)  
2. Toggle off **Test mode**  
3. Create the **same product** again in Live mode (or copy)  
4. Copy **live** `sk_live_...` and live `price_...`  
5. Update Vercel env vars to live keys  
6. Redeploy  
7. Do one real $19 charge with your own card, then refund yourself in Stripe  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Upgrade button says payments not configured | Env vars missing or no redeploy |
| Checkout error | Wrong `STRIPE_PRICE_ID` or still using test price with live key |
| Paid but still free tier | Complete `/pro/success` page; cookies blocked? Try same browser |
| Portal error | Activate Customer portal in Stripe settings |
| "No subscription found" | Pay again from same browser; cookie is per-browser |

---

## When you're done

Reply: **Stripe works**

Then we start marketing (Reddit etc.) with a real paid upgrade path.
