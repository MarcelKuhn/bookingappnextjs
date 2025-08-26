'use client';
import * as React from 'react';
import SearchBar from '@/components/SearchBar';
import DealsRail from '@/components/DealsRail';

export default function Page(){
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchPerformed, setSearchPerformed] = React.useState(false);

  const handleSearch = async (params: any) => {
    setIsSearching(true);
    setSearchPerformed(true);
    try {
      const r = await fetch('/api/search', { 
        method: 'POST', 
        headers: { 'Content-Type':'application/json' }, 
        body: JSON.stringify(params) 
      });
      const { data } = await r.json();
      setResults(data || []);
      // Dispatch custom event for DealsRail
      window.dispatchEvent(new CustomEvent('sleep:results', { detail: data || [] }));
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">⚡</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          Sleep‑&‑Charge: EV‑friendly Hotels in the USA
        </h1>
        <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
          Find hotels with fast charging stations nearby and book directly via Booking.com. 
          Perfect for your next electric vehicle road trip!
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <section>
        {isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            <p className="mt-4 text-slate-600">Searching for EV-friendly hotels...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                {searchPerformed ? 'Search Results' : 'Discover EV-friendly Hotels'}
              </h2>
              {results.length > 0 && (
                <div className="text-sm text-slate-500">
                  {results.length} {results.length === 1 ? 'Hotel' : 'Hotels'} found
                </div>
              )}
            </div>
            <DealsRail initial={results} />
          </>
        )}
      </section>

      {!searchPerformed && (
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-slate-900 mb-2">Fast Charger Proximity</h3>
              <p className="text-sm text-slate-600">Hotels with fast chargers within 800m distance</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🏨</div>
              <h3 className="font-semibold text-slate-900 mb-2">Best Prices</h3>
              <p className="text-sm text-slate-600">Direct Booking.com integration for the best deals</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="font-semibold text-slate-900 mb-2">Roadtrip Ready</h3>
              <p className="text-sm text-slate-600">Perfect for your next electric vehicle journey through the USA</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}