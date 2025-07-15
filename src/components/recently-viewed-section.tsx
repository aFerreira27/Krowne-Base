
'use client';

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export function RecentlyViewedSection() {
  const { recentlyViewedProducts, hydrated } = useRecentlyViewed();

  // Render a loading state until the hook has rehydrated from localStorage on the client
  if (!hydrated) {
    return (
      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-full aspect-[4/5]" />)}
        </div>
      </section>
    );
  }

  // If hydrated but no items, render nothing to avoid layout shifts.
  if (recentlyViewedProducts.length === 0) {
    return null;
  }
  
  // Only render the full component once we have the data on the client
  return (
    <section>
      <h2 className="text-2xl font-headline font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recentlyViewedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
