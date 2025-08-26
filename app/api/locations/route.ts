import { NextRequest } from 'next/server';
import { fetchCitySuggestions } from '@/lib/booking';

export async function GET(req: NextRequest){
  const q = req.nextUrl.searchParams.get('q')?.trim() || '';
  if (!q || q.length < 2) return new Response(JSON.stringify({ data: [] }), { headers: { 'Content-Type': 'application/json' } });
  
  try {
    const data = await fetchCitySuggestions(q);
    return Response.json({ data });
  } catch (error) {
    console.error('Location search error:', error);
    return Response.json({ data: [] });
  }
}