const BASE = process.env.BOOKING_API_BASE!;
const AFFILIATE = process.env.BOOKING_AFFILIATE_ID!;
const TOKEN = process.env.BOOKING_API_TOKEN!;

if (!BASE || !AFFILIATE || !TOKEN) {
  console.warn('⚠️ Missing Booking env vars.');
}

export type CitySuggestion = { id: number; name: string; country: string; lat?: number; lon?: number };

export async function fetchCitySuggestions(q: string, country = process.env.APP_DEFAULT_COUNTRY || 'us') {
  const r = await fetch(`${BASE}/common/locations/cities`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE
    },
    body: JSON.stringify({ name: q, country })
  });
  if (!r.ok) throw new Error('cities search failed');
  const { data } = await r.json();
  return (data || []).slice(0, 10).map((c: any) => ({ 
    id: c.id, 
    name: c.name, 
    country: c.country, 
    lat: c.coordinates?.latitude, 
    lon: c.coordinates?.longitude 
  })) as CitySuggestion[];
}

export type SearchParams = {
  cityId?: number;
  coords?: { lat: number; lon: number };
  checkin: string; // yyyy-mm-dd
  checkout: string; // yyyy-mm-dd
  adults: number;
  rooms: number;
  radiusMeters: number; // for EV layer
  facilities?: number[]; // Booking facility ids
  payAtProperty?: boolean;
  dealsOnly?: boolean; // filter products with deal tags
};

export async function searchAccommodations(params: SearchParams) {
  const body: any = {
    booker: { country: process.env.APP_DEFAULT_COUNTRY || 'us', platform: 'desktop' },
    checkin: params.checkin,
    checkout: params.checkout,
    guests: { number_of_rooms: params.rooms, number_of_adults: params.adults },
    currency: process.env.APP_DEFAULT_CURRENCY || 'USD',
    extras: [ 'products', 'extra_charges' ],
    rows: 40,
    sort: { by: 'price', order: 'asc' }
  };
  if (params.cityId) body.city = params.cityId;
  if (params.facilities?.length) body.room_facilities = params.facilities; // property/room facilities filter
  if (params.payAtProperty) body.payment = { timings: ['pay_at_the_property'] };

  const r = await fetch(`${BASE}/accommodations/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('search failed');
  const json = await r.json();
  return json;
}

export async function fetchAccommodationDetails(ids: number[]) {
  const r = await fetch(`${BASE}/accommodations/details`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Affiliate-Id': AFFILIATE
    },
    body: JSON.stringify({ accommodations: ids, extras: ['photos', 'facilities', 'payment'] })
  });
  if (!r.ok) throw new Error('details failed');
  return r.json();
}