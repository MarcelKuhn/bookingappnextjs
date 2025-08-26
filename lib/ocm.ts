const OCM_BASE = process.env.OCM_API_BASE!;
const OCM_KEY = process.env.OCM_API_KEY!;

export type Charger = {
  ID: number;
  AddressInfo: { Latitude: number; Longitude: number; Title: string; Distance?: number; };
  Connections?: { LevelID?: number; PowerKW?: number }[];
};

export function haversineMeters(a: {lat:number;lon:number}, b: {lat:number;lon:number}){
  const toRad = (d:number)=> d * Math.PI / 180;
  const R = 6371000; // m
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export async function fetchChargersBoundingBox(bbox: {minLat:number; minLon:number; maxLat:number; maxLon:number}){
  const url = `${OCM_BASE}/poi/?maxresults=5000&compact=true&verbose=false&boundingbox=(${bbox.minLat},${bbox.minLon}),(${bbox.maxLat},${bbox.maxLon})&key=${OCM_KEY}`;
  const r = await fetch(url, { headers: { 'User-Agent': 'sleep-and-charge/1.0' } });
  if (!r.ok) throw new Error('OCM bbox fetch failed');
  const data = await r.json() as Charger[];
  // Keep only likely fast chargers (Level 3 or >=50kW)
  return data.filter(c => (c.Connections||[]).some(x => (x.LevelID===3) || ((x.PowerKW||0) >= 50)));
}