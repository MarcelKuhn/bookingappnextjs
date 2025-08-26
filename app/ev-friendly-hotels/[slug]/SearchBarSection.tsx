'use client';

import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import type { Route } from 'next'; // optional, aber nett

export default function SearchBarSection() {
  const router = useRouter();

  async function onSearch(q: string) {
    const query = q.trim();
    if (!query) return;

    // Variante B: allgemeiner Route-Cast (falls du mehr Query-Teile hast)
    router.push((`/search?q=${encodeURIComponent(query)}` as Route));
  }

  return <SearchBar onSearch={onSearch} />;
}
