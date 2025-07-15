
'use client';

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export function RecentlyViewedSection() {
  const { recentlyViewedProducts, hydrated } = useRecentlyViewed();

  if (recentlyViewedProducts.length === 0 && hydrated) {
    return null;
  }
  
  return (
    <section>
      <h2 className="text-2xl font-headline font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {!hydrated ? (
           [...Array(5)].map((_, i) => <Skeleton key={i} className="h-full aspect-[4/5]" />)
        ) : (
          recentlyViewedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}
