# Tarot by Ananya

SuperProfile-style link-in-bio + booking site for Tarot by Ananya, with Razorpay payments.

## Features

- Dark profile home with circular avatar, bio, Instagram, and CTA
- Expandable service pills (Vashikaran, 60 / 30 / 15 min sessions)
- WhatsApp DM link
- Booking flow with date + time slot picker (10:00 AM – 10:00 PM)
- Razorpay checkout (order create + signature verify)
- Netlify Forms booking notification after successful payment

## Develop

```bash
npm install
cp .env.example .env
# add Razorpay test keys to .env
npm run dev
```

Edit profile, prices, WhatsApp, and copy in `src/data/content.ts`.

## Razorpay setup

1. Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Copy **Key ID** and **Key Secret** (use Test mode first)
3. In Netlify: **Site configuration → Environment variables**, add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Redeploy the site

Locally, put the same vars in a `.env` file (see `.env.example`).

Flow:
1. Customer picks a slot and enters email/phone
2. `POST /api/create-order` creates a Razorpay order
3. Razorpay Checkout opens
4. `POST /api/verify-payment` verifies the signature
5. Slot is marked booked + Netlify form submission is stored
