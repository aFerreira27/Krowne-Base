
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, clearProducts } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { ProductSearch } from '@/components/product-search';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    // getProducts needs to run on the client to access localStorage
    const allProducts = getProducts(query);
    setProducts(allProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);
  
  const handleClearProducts = () => {
    clearProducts();
    fetchProducts(); // Refresh the list after clearing
  };

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all custom-added products from your local storage. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearProducts}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

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
            {query ? `Your search for "${query}" did not match any products.` : 'There are no products in the database.'}
          </p>
        </div>
      )}
    </div>
  );
}
