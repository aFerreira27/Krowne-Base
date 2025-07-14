import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ProductSearch } from '@/components/product-search';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || '';
  const products = getProducts(query);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Product Database</h1>
        <p className="text-muted-foreground mt-1">Browse and search for all available products.</p>
      </div>
      
      <ProductSearch />

      {products.length > 0 ? (
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
