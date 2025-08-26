import { NextRequest } from 'next/server';
import { cacheGet, cacheSet } from '@/lib/cache';
import { fetchAccommodationDetails, searchAccommodations } from '@/lib/booking';
import { fetchChargersBoundingBox, haversineMeters } from '@/lib/ocm';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest){
  const body = await req.json();
  const { cityId, checkin, checkout, adults, rooms, facilities, payAtProperty, dealsOnly, radiusMeters=800 } = body;
  if (!checkin || !checkout) return new Response('Missing dates', { status: 400 });

  const cacheKey = `s:${cityId}:${checkin}:${checkout}:${adults}:${rooms}:${(facilities||[]).join(',')}:${payAtProperty}:${dealsOnly}`;
  const cached = cacheGet<any>(cacheKey);
  if (cached) return Response.json(cached);

  try {
    const search = await searchAccommodations({ cityId, checkin, checkout, adults, rooms, facilities, payAtProperty, dealsOnly, radiusMeters });
    const items = (search.data || []);
    const ids = items.map((x:any)=> x.id).slice(0, 40);
    const details = await fetchAccommodationDetails(ids);
    const detailById = new Map<number, any>();
    for (const d of (details.data||[])) detailById.set(d.id, d);

    // Build bbox from hotels (to query OCM once)
    const coords = (details.data||[]).map((d:any)=> d.coordinates).filter(Boolean);
    if (coords.length === 0) {
      return Response.json({ data: [] });
    }
    
    const minLat = Math.min(...coords.map((c:any)=> c.latitude));
    const maxLat = Math.max(...coords.map((c:any)=> c.latitude));
    const minLon = Math.min(...coords.map((c:any)=> c.longitude));
    const maxLon = Math.max(...coords.map((c:any)=> c.longitude));

    let chargers:any[] = [];
    try{
      chargers = await fetchChargersBoundingBox({ minLat, minLon, maxLat, maxLon });
    }catch(e){ 
      console.error('OCM fetch error:', e);
      /* non‑fatal */ 
    }

    const result = items.map((row:any)=>{
      const d = detailById.get(row.id) || {};
      const img = d.photos?.[0]?.url || null;
      const coord = d.coordinates || row.coordinates;
      // Count fast chargers within radius
      const evNearby = coord ? chargers.filter((c)=> {
        const dist = haversineMeters({lat: coord.latitude, lon: coord.longitude}, {lat: c.AddressInfo.Latitude, lon: c.AddressInfo.Longitude});
        return dist <= radiusMeters;
      }) : [];

      // Filter by deals if requested
      const hasDeal = !!row.products?.some((p:any)=> p.deal?.active || (p.deal?.tags?.length));
      if (dealsOnly && !hasDeal) return null;

      // Payment timing surface (if available via details/payment)
      const payAtProp = !!d?.payment?.timings?.includes?.('pay_at_the_property');
      if (payAtProperty && !payAtProp) return null;

      return {
        id: row.id,
        name: row.name,
        url: row.url, // affiliate url from search
        currency: row.currency,
        price: row.price,
        review_score: row.review_score,
        address: d?.address || null,
        facilities: d?.facilities || [],
        pay_at_property: payAtProp,
        coordinates: coord,
        image: img,
        deals: row.products?.flatMap((p:any)=> p.deal?.tags || []) || [],
        ev: { count: evNearby.length, radiusMeters }
      };
    }).filter(Boolean);

    cacheSet(cacheKey, { data: result }, 1000 * 60 * 10); // 10 min cache
    return Response.json({ data: result });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ data: [], error: 'Search failed' }, { status: 500 });
  }
}