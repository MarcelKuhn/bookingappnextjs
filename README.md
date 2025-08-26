# Sleep‑&‑Charge: EV‑Roadtrip‑Hotels

> Minimalist US‑focused hotel search that surfaces **EV‑friendly** stays (fast chargers within ~0.5 mi / 800 m), filters by facilities, payments, and deal tags, and redirects via your **Booking.com affiliate URL** to complete the booking.

## Features

- 🔋 **EV-Charger Integration**: Find hotels near fast charging stations using OpenChargeMap API
- 🏨 **Booking.com Integration**: Direct affiliate booking with real-time availability and pricing
- 🚗 **US-Focused**: Optimized for American road trips and EV infrastructure
- 💰 **Deal Filtering**: Surface hotels with active deals and special rates
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- ⚡ **Fast Performance**: Server-side caching and optimized API calls

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your API credentials:

```bash
cp .env.local.example .env.local
```

### 2. Booking.com API Setup

1. Sign up for [Booking.com Partner Centre](https://partner.booking.com/)
2. Create a new application and get your:
   - Bearer Token (`BOOKING_API_TOKEN`)
   - Affiliate ID (`BOOKING_AFFILIATE_ID`)
3. Add your domain to the allowlist in Partner Centre

### 3. OpenChargeMap API Setup

1. Get a free API key from [OpenChargeMap](https://openchargemap.org/site/develop/api)
2. Add it as `OCM_API_KEY` in your `.env.local`

### 4. Development

```bash
npm install
npm run dev
```

### 5. Production Deployment

Deploy to Vercel or your preferred hosting platform:

```bash
npm run build
npm start
```

## WordPress Integration

The included WordPress plugin (`wordpress-plugin/sleep-charge.php`) allows you to embed the app:

1. Upload the plugin folder to your WordPress site
2. Activate the plugin
3. Use `[sleep_charge]` shortcode or let it auto-insert on homepage

## API Endpoints

- `GET /api/locations?q={query}` - City autocomplete
- `POST /api/search` - Hotel search with EV charger data

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **APIs**: Booking.com Demand API + OpenChargeMap API
- **Caching**: LRU cache for performance optimization
- **Deployment**: Static export ready for any hosting platform

## License

Private project - All rights reserved.