'use client';

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export function RecentlyViewedSection() {
  const { recentlyViewedProducts, hydrated } = useRecentlyViewed();

  if (!hydrated) {
    return (
      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  if (recentlyViewedProducts.length === 0) {
    return null;
  }

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
