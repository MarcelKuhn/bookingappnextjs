// Static content that prerenders popular interstates & metros
// app/ev-friendly-hotels/[slug]page.tsx

import type { Metadata } from 'next';
import SearchBarSection from './SearchBarSection';


const PRESETS: Record<string, { title: string; intro: string; cityId?: number }> = {
  'i-95': { 
    title: 'EV‑friendly Hotels along I‑95', 
    intro: 'The best accommodations with fast charging stations along the I‑95 corridor from Maine to Florida.' 
  },
  'i-5': { 
    title: 'EV‑friendly Hotels along I‑5', 
    intro: 'Hotels with fast chargers along I‑5 from the Canadian border to Mexico.' 
  },
  'los-angeles': { 
    title: 'EV‑friendly Hotels in Los Angeles', 
    intro: 'Top hotels with fast charging stations nearby in the LA metro area.' 
  },
  'san-francisco': { 
    title: 'EV‑friendly Hotels in San Francisco', 
    intro: 'The best hotels with EV charging stations in the San Francisco Bay Area.' 
  },
  'new-york': { 
    title: 'EV‑friendly Hotels in New York', 
    intro: 'Hotels with fast charging stations in the Big Apple and surrounding area.' 
  },
  'chicago': { 
    title: 'EV‑friendly Hotels in Chicago', 
    intro: 'Top accommodations with fast chargers in the Windy City.' 
  }
};


export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const p = PRESETS[slug] || { title: 'EV-freundliche Hotels', intro: '' };
  return {
    title: `${p.title} | Sleep-&-Charge`,
    description: p.intro,
    openGraph: {
      title: `${p.title} | Sleep-&-Charge`,
      description: p.intro,
      type: 'website',
    },
  };
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = PRESETS[slug];

  if (!p) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <p className="text-slate-600">The requested route is not available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{p.title}</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-3xl">{p.intro}</p>

        {/* Statt <SearchBar onSearch={...} /> jetzt der Client-Wrapper: */}
        <SearchBarSection />
      </section>
      
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Choose EV-friendly Hotels?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">🔋 Stress-free Charging</h3>
            <p className="text-sm text-slate-600">No worries about range - your hotel is always near a fast charging station.</p>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">⏰ Save Time</h3>
            <p className="text-sm text-slate-600">While you sleep, your car charges. Perfect for long road trips.</p>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">💰 Save Money</h3>
            <p className="text-sm text-slate-600">Avoid expensive hotel charging fees with nearby public stations.</p>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">🌍 Eco-friendly</h3>
            <p className="text-sm text-slate-600">Travel sustainably knowing charging options are available.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(PRESETS).map((slug) => ({ slug }));
}