'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ProductSearch } from '@/components/product-search';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // getProducts needs to run on the client to access localStorage
    const allProducts = getProducts(query);
    setProducts(allProducts);
    setLoading(false);
  }, [query]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Product Database</h1>
        <p className="text-muted-foreground mt-1">Browse and search for all available products.</p>
      </div>
      
      <ProductSearch />

      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[400px]" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <h2 className="text-xl font-medium">No Products Found</h2>
          <p className="text-muted-foreground mt-2">
            Your search for "{query}" did not match any products.
          </p>
        </div>
      )}
    </div>
  );
}
