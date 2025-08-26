'use client';
import * as React from 'react';
import HotelCard from './HotelCard';

export default function DealsRail({ initial }:{ initial:any[] }){
  const [items,setItems] = React.useState<any[]>(initial||[]);
  
  React.useEffect(()=>{
    const handleResults = (e: any) => setItems(e.detail || []);
    window.addEventListener('sleep:results', handleResults);
    return ()=> window.removeEventListener('sleep:results', handleResults);
  },[]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-lg font-medium mb-2">No Hotels Found</h3>
        <p>Try a different city or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(x=> <HotelCard key={x.id} item={x} />)}
    </div>
  );
}