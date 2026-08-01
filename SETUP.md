# QuoteKit — Your Idiot-Proof Launch Guide

Everything below is **your** job. I already built the product. Follow these steps in order.

---

## What you have

**QuoteKit** — a free quote/proposal generator for freelancers and contractors.

- **Free tier:** 3 PDF exports per month (drives upgrades)
- **Pro tier:** $19/month — unlimited exports, branding, saved clients (wire up Stripe in Phase 2)
- **Money path:** SEO traffic → free tool → paid subscriptions

---

## Phase 1: See it running on your computer (10 minutes)

### Step 1 — Open a terminal in the project folder

1. Press `Win + R`, type `cmd`, press Enter
2. Paste this and press Enter:

```
cd C:\Users\mmaro\Desktop\Projects\passive_incom\quotekit
```

### Step 2 — Install dependencies

Paste and press Enter (wait 1–3 minutes):

```
npm install
```

### Step 3 — Start the app

Paste and press Enter:

```
npm run dev
```

### Step 4 — Open in browser

Go to: **http://localhost:3000**

You should see the QuoteKit landing page. Click **Create Quote** and try building a quote.

To stop the server: press `Ctrl + C` in the terminal.

---

## Phase 2: Put it on the internet for FREE (20 minutes)

This uses **Vercel** (free hosting) + **GitHub** (free code storage).

### Step 1 — Create a GitHub account (skip if you have one)

1. Go to https://github.com/signup
2. Create a free account
3. Verify your email

### Step 2 — Create a new repository

1. Go to https://github.com/new
2. Repository name: `quotekit`
3. Keep it **Public** (required for free Vercel)
4. Do NOT add README, .gitignore, or license (we already have those)
5. Click **Create repository**

### Step 3 — Upload the code to GitHub

In your terminal (in the `quotekit` folder), run these **one at a time**:

```
git init
```

```
git add .
```

```
git commit -m "Initial QuoteKit launch"
```

Replace `YOUR_USERNAME` with your actual GitHub username:

```
git remote add origin https://github.com/YOUR_USERNAME/quotekit.git
```

```
git branch -M main
```

```
git push -u origin main
```

If it asks you to log in, follow the browser prompts.

### Step 4 — Deploy on Vercel

1. Go to https://vercel.com/signup
2. Sign up with your **GitHub account** (easiest)
3. Click **Add New… → Project**
4. Import your `quotekit` repository
5. Leave all settings as default
6. Click **Deploy**
7. Wait 2–3 minutes

You'll get a URL like `quotekit-abc123.vercel.app` — **your app is live.**

### Step 5 — (Optional) Custom domain

When you're ready to buy a domain (~$10/year):

1. Buy `quotekit.app` or similar from Namecheap, Cloudflare, or Google Domains
2. In Vercel: Project → Settings → Domains → Add your domain
3. Follow Vercel's DNS instructions (copy/paste records at your registrar)

---

## Phase 3: Start getting visitors (ongoing — this is where money comes from)

You don't need to be a marketer. Do these in order:

### Week 1 — Seed the internet

Post in places where freelancers and contractors hang out. **Be helpful, not spammy.**

Copy/paste template (customize slightly each time):

> I built a free quote generator for freelancers/contractors — no signup, instant PDF download. Would love feedback: [YOUR VERCEL URL]/builder

Post in:

- r/freelance
- r/smallbusiness
- r/Entrepreneur
- r/Contractor
- Facebook groups for local contractors or freelancers
- Indie Hackers: https://www.indiehackers.com

### Week 2 — Submit to directories (free backlinks = Google traffic later)

Submit your live URL to:

- https://www.producthunt.com (launch when ready)
- https://alternativeto.net
- https://www.saashub.com
- https://www.freelancetools.online (if they accept submissions)

### Week 3+ — SEO content (I can write these for you)

Target searches like:

- "free quote generator"
- "contractor estimate template"
- "freelancer proposal PDF"

Each article links to `/builder`. This is slow (2–6 months) but compounds forever.

---

## Phase 4: Turn on payments (when you have traffic)

Do this when people are actually using the free tool. No rush on day 1.

### Stripe setup (free until you earn)

1. Go to https://dashboard.stripe.com/register
2. Create account, verify identity
3. Products → Add Product → "QuoteKit Pro" → $19/month recurring
4. Copy your **Publishable key** and **Secret key**
5. In Vercel: Project → Settings → Environment Variables → Add:
   - `STRIPE_SECRET_KEY` = your secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key
   - `NEXT_PUBLIC_SITE_URL` = your live URL (e.g. `https://quotekit.vercel.app`)
6. Redeploy

Then tell me: **"Wire up Stripe"** and I'll add the checkout flow.

---

## Phase 5: Revenue math (so you know what you're aiming for)

| Milestone | What it means |
|-----------|---------------|
| 100 visitors/month | Early traction — keep posting |
| 500 visitors/month | ~5–15 Pro signups possible ($95–$285/mo) |
| 2,000 visitors/month | ~$500–$1,500/mo realistic with conversions |
| 10,000 visitors/month | $3,000–$8,000/mo — real passive income |

Conversion rate for freemium tools: typically **1–3%** of active users hit a paywall and ~**10–30%** of those convert.

---

## What to tell me next

Reply with one of these:

1. **"It's running locally"** — I'll help you test and polish
2. **"It's deployed at [URL]"** — I'll write SEO articles and social posts
3. **"Wire up Stripe"** — I'll add payments
4. **"Something broke"** — paste the error, I'll fix it

---

## Quick troubleshooting

| Problem | Fix |
|---------|-----|
| `npm install` fails | Run `npm cache clean --force`, then `npm install` again |
| Port 3000 in use | Run `npm run dev -- -p 3001` and open http://localhost:3001 |
| `git push` asks for password | Use GitHub personal access token instead of password |
| Vercel build fails | Tell me the error from the Vercel dashboard |
| PDF won't download | Try Chrome; allow pop-ups for localhost |

You got this. The hard part (building) is done.