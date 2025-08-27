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
        <main className="container py-8">
          {children}
        </main>
        <footer className="bg-slate-100 border-t border-slate-200">
          <div className="container py-8">
            <div className="text-center text-sm text-slate-600">
               <p className="mb-2"></p>
              <p></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}