# How to see if anyone uses QuoteKit

Two free options. Do **#1** at minimum (2 minutes).

---

## 1. Vercel Web Analytics (do this now)

No new account. Uses your existing Vercel project.

1. Go to https://vercel.com/dashboard  
2. Open project **quotekit**  
3. Click **Analytics**  
4. Click **Enable** on **Web Analytics** (Hobby / free is fine)  
5. Wait for the next deploy if it asks (or Redeploy once)

**What you’ll see:** visitors, page views, top pages over time.

**Tip:** After people use the tool, check whether `/builder` shows up.  
PDF downloads fire an event called `pdf_export` (visible if custom events show in your Analytics UI).

Also open on the site: https://quotekit-silk.vercel.app/stats  
(that page is a reminder of where to look — not a public leaderboard)

---

## 2. Google Analytics 4 (optional, free, more detail)

Best for: “how many unique people” + “how many PDF downloads.”

### Create a GA4 property

1. Go to https://analytics.google.com  
2. Admin (gear) → **Create property**  
3. Name: `QuoteKit`  
4. Create a **Web** data stream  
5. Website URL: `https://quotekit-silk.vercel.app`  
6. Copy the **Measurement ID** — looks like `G-XXXXXXXXXX`

### Add it to Vercel

1. Vercel → quotekit → **Settings** → **Environment Variables**  
2. Add:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

3. **Redeploy** the project  

### Where to look

- analytics.google.com → **Reports** → **Realtime** (are people here *now*?)  
- **Engagement** → **Events** → `pdf_export` (downloads)  
- **Engagement** → **Pages** → `/builder`  

---

## What “success” looks like early on

| Signal | Meaning |
|--------|---------|
| 0 visitors | Nobody knows the link yet (normal) |
| Home page views, 0 builder | Curiosity, didn’t try tool |
| Builder views, few pdf_export | Tried, didn’t finish |
| pdf_export rising | Real usage |

Don’t panic at zeros for weeks unless you’ve been promoting hard.

---

## Privacy note

Quote form data (names, emails you type into quotes) stays in the browser and PDF — we don’t send that to analytics. Analytics only sees page visits and “someone exported a PDF,” not quote contents.
