
'use client';

import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { ClientOnly } from './client-only';

export function RecentlyViewedSection() {
  const { recentlyViewedProducts } = useRecentlyViewed();

  return (
    <section>
      <h2 className="text-2xl font-headline font-bold mb-4">Recently Viewed</h2>
      <ClientOnly>
        {recentlyViewedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recentlyViewedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </ClientOnly>
    </section>
  );
}
