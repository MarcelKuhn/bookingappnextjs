'use client';
import * as React from 'react';
import { Toggle } from './ui';

type City = { id:number; name:string };

export default function SearchBar({ onSearch }:{ onSearch:(params:any)=>void }){
  const [q,setQ] = React.useState('');
  const [suggestions,setSuggestions] = React.useState<City[]>([]);
  const [selected,setSelected] = React.useState<City|undefined>();
  const [isLoading,setIsLoading] = React.useState(false);

  const [checkin,setCheckin] = React.useState<string>(()=> new Date(Date.now()+1000*60*60*24*7).toISOString().slice(0,10));
  const [checkout,setCheckout] = React.useState<string>(()=> new Date(Date.now()+1000*60*60*24*8).toISOString().slice(0,10));
  const [adults,setAdults] = React.useState(2);
  const [rooms,setRooms] = React.useState(1);
  const [radius,setRadius] = React.useState(800);
  const [payAtProperty,setPayAtProperty] = React.useState(false);
  const [dealsOnly,setDealsOnly] = React.useState(true);

  React.useEffect(()=>{
    const t = setTimeout(async ()=>{
      if (q.length < 2) { setSuggestions([]); return; }
      try {
        const r = await fetch(`/api/locations?q=${encodeURIComponent(q)}`);
        const { data } = await r.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Location search failed:', error);
        setSuggestions([]);
      }
    }, 200);
    return ()=> clearTimeout(t);
  }, [q]);

  const handleSearch = async () => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await onSearch({ 
        cityId: selected.id, 
        checkin, 
        checkout, 
        adults, 
        rooms, 
        radiusMeters: radius, 
        payAtProperty, 
        dealsOnly 
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <input 
            className="input" 
            placeholder="Where in the USA? (City / Region)" 
            value={q} 
            onChange={e=>{ setQ(e.target.value); setSelected(undefined); }} 
          />
          { suggestions.length>0 && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
              {suggestions.map(c=> (
                <button 
                  key={c.id} 
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl transition-colors" 
                  onClick={()=>{ setSelected(c); setQ(c.name); setSuggestions([]); }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
          <input type="date" className="input" value={checkin} onChange={e=>setCheckin(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
          <input type="date" className="input" value={checkout} onChange={e=>setCheckout(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
            <input type="number" min={1} className="input" value={adults} onChange={e=>setAdults(parseInt(e.target.value||'1'))} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Rooms</label>
            <input type="number" min={1} className="input" value={rooms} onChange={e=>setRooms(parseInt(e.target.value||'1'))} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">EV Radius:</label>
          <input 
            type="range" 
            min={200} 
            max={2000} 
            step={100} 
            value={radius} 
            onChange={e=>setRadius(parseInt(e.target.value))}
            className="w-24" 
          />
          <span className="text-sm text-slate-500 min-w-[60px]">{Math.round(radius)} m</span>
        </div>
        <Toggle label="Deals first" checked={dealsOnly} onChange={setDealsOnly} />
        <Toggle label="Pay at property" checked={payAtProperty} onChange={setPayAtProperty} />
        <button 
          className={`btn ml-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSearch}
          disabled={!selected || isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
}