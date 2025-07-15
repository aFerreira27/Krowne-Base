
import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductSearch } from '@/components/product-search';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ClearButton } from '@/components/clear-button';

async function getProducts(query?: string): Promise<Product[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL('/api/products', baseUrl);
    if (query) {
        url.searchParams.append('q', query);
    }
    const res = await fetch(url.toString(), { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

async function ProductList({ query }: { query: string }) {
  const products = await getProducts(query);

  return products.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="text-center py-16 border rounded-lg">
      <h2 className="text-xl font-medium">No Products Found</h2>
      <p className="text-muted-foreground mt-2">
        {query ? `Your search for "${query}" did not match any products.` : 'There are no products in the database.'}
      </p>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[400px]" />)}
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
  const query = searchParams?.q || '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Product Database</h1>
        <p className="text-muted-foreground mt-1">Browse and search for all available products.</p>
      </div>
      
      <div className="flex justify-between items-center gap-4">
        <div className="flex-grow">
          <ProductSearch />
        </div>
        <ClearButton />
      </div>

      <Suspense key={query} fallback={<ProductListSkeleton />}>
        <ProductList query={query} />
      </Suspense>
    </div>
  );
}
