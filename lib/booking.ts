//lib/bookings.ts

import 'server-only';

export type CitySuggestion = {
  id: number;
  name: string;
  country: string;
  lat?: number;
  lon?: number;
};

type Cfg = {
  BASE: string;
  AFFILIATE: string;
  TOKEN: string;
  COUNTRY: string;
  CURRENCY: string;
};

function getCfg(): Cfg {
  const BASE = process.env.BOOKING_API_BASE;
  const AFFILIATE = process.env.BOOKING_AFFILIATE_ID;
  const TOKEN = process.env.BOOKING_API_TOKEN;
  const COUNTRY = process.env.APP_DEFAULT_COUNTRY ?? 'us';
  const CURRENCY = process.env.APP_DEFAULT_CURRENCY ?? 'USD';

  if (!BASE || !AFFILIATE || !TOKEN) {
    // Wirf erst zur Laufzeit (im Request), NICHT beim Import
    throw new Error(
      'Missing Booking env vars: set BOOKING_API_BASE, BOOKING_AFFILIATE_ID, BOOKING_API_TOKEN'
    );
  }
  return { BASE, AFFILIATE, TOKEN, COUNTRY, CURRENCY };
}

export async function fetchCitySuggestions(q: string, country?: string) {
  const { BASE, AFFILIATE, TOKEN, COUNTRY } = getCfg();

  const r = await fetch(`${BASE}/common/locations/cities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE,
      Accept: 'application/json',
    },
    body: JSON.stringify({ name: q, country: country ?? COUNTRY }),
    cache: 'no-store', // alternativ: next: { revalidate: 60 }
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`cities search failed: ${r.status} ${text}`);
  }

  const { data } = (await r.json()) as { data?: any[] };
  return (data ?? []).slice(0, 10).map((c: any) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    lat: c.coordinates?.latitude,
    lon: c.coordinates?.longitude,
  })) as CitySuggestion[];
}

export type SearchParams = {
  cityId?: number;
  coords?: { lat: number; lon: number };
  checkin: string; // yyyy-mm-dd
  checkout: string; // yyyy-mm-dd
  adults: number;
  rooms: number;
  radiusMeters: number;
  facilities?: number[];
  payAtProperty?: boolean;
  dealsOnly?: boolean;
};

export async function searchAccommodations(params: SearchParams) {
  const { BASE, AFFILIATE, TOKEN, COUNTRY, CURRENCY } = getCfg();

  const body: any = {
    booker: { country: COUNTRY, platform: 'desktop' },
    checkin: params.checkin,
    checkout: params.checkout,
    guests: { number_of_rooms: params.rooms, number_of_adults: params.adults },
    currency: CURRENCY,
    extras: ['products', 'extra_charges'],
    rows: 40,
    sort: { by: 'price', order: 'asc' },
  };
  if (params.cityId) body.city = params.cityId;
  if (params.facilities?.length) body.room_facilities = params.facilities;
  if (params.payAtProperty) body.payment = { timings: ['pay_at_the_property'] };

  const r = await fetch(`${BASE}/accommodations/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store', // oder next: { revalidate: 60 }
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`search failed: ${r.status} ${text}`);
  }
  return r.json();
}

export async function fetchAccommodationDetails(ids: number[]) {
  const { BASE, AFFILIATE, TOKEN } = getCfg();

  const r = await fetch(`${BASE}/accommodations/details`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE,
      Accept: 'application/json',
    },
    body: JSON.stringify({ accommodations: ids, extras: ['photos', 'facilities', 'payment'] }),
    cache: 'no-store',
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`details failed: ${r.status} ${text}`);
  }
  return r.json();
}