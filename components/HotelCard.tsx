'use client';
import Image from 'next/image';
import { Badge } from './ui';

export default function HotelCard({ item }: { item: any }){
  const href = item.url; // already includes affiliate & dates
  return (
    <a href={href} target="_blank" rel="nofollow noopener" className="card overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-0">
        <div className="relative h-[120px] w-[140px] md:w-[160px] bg-slate-100">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-400 text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">{item.name}</h3>
            {item.review_score && (
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>⭐</span>
                <span>{(item.review_score / 10).toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="mt-1 text-sm text-slate-600 line-clamp-1">{item.address?.address_line || ''}</div>
          
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {item.ev?.count > 0 && (
              <Badge variant="success">
                ⚡ {item.ev.count} fast chargers ≤{Math.round((item.ev.radiusMeters||800)/1609.34*10)/10} mi
              </Badge>
            )}
            {item.pay_at_property && <Badge>Pay at property</Badge>}
            {Array.isArray(item.deals) && item.deals.length > 0 && <Badge variant="warning">Deals</Badge>}
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="text-brand-700 font-semibold text-lg">
              {item.currency} {Number(item.price?.book||item.price?.base||0).toFixed(0)}
            </div>
            <div className="text-xs text-slate-500">
              per night
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}