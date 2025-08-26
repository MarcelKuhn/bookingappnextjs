import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sleep‑&‑Charge | EV‑friendly hotels near fast chargers',
  description: 'Find US hotels with fast EV chargers nearby and book via Booking.com.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Sleep‑&‑Charge | EV‑friendly hotels in the USA',
    description: 'Find hotels with fast charging stations nearby and book via Booking.com.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-brand-700 text-white shadow-lg">
          <div className="container py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-brand-600 font-bold text-lg">⚡</span>
              </div>
              <div>
                <div className="font-bold text-lg">Sleep‑&‑Charge</div>
                <div className="text-brand-200 text-sm">EV‑friendly Hotels</div>
              </div>
            </div>
          </div>
        </header>
        <main className="container py-8">
          {children}
        </main>
        <footer className="bg-slate-100 border-t border-slate-200">
          <div className="container py-8">
            <div className="text-center text-sm text-slate-600">
              <p className="mb-2">As an affiliate, we may earn from qualifying bookings.</p>
              <p>Prices & availability subject to change. All information without guarantee.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}