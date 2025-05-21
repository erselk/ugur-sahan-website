'use client';

import { Suspense } from 'react';
import SearchResults from '@/components/search/SearchResults';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchResults />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
} 