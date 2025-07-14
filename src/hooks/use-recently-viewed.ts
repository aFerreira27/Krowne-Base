
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products-client'; // We need a client-side fetcher

const RECENTLY_VIEWED_KEY = 'krowne_recently_viewed';
const MAX_RECENT_ITEMS = 5;

export function useRecentlyViewed() {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load IDs from localStorage on initial mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
      const ids = item ? JSON.parse(item) : [];
      setProductIds(ids);
    } catch (error) {
      console.error("Failed to parse recently viewed items from localStorage", error);
      setProductIds([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save IDs to localStorage whenever they change
  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(productIds));
      } catch (error) {
        console.error("Failed to save recently viewed items to localStorage", error);
      }
    }
  }, [productIds, hydrated]);

  // Fetch product data when IDs change
  useEffect(() => {
    if (hydrated && productIds.length > 0) {
      const fetchProducts = async () => {
        // Since getProductById is now a server function, we can't call it here directly.
        // We'll fetch them one by one or create a dedicated client-side batch fetcher.
        const products: Product[] = [];
        for (const id of productIds) {
          try {
            const product = await getProductById(id);
            if (product) {
              products.push(product);
            }
          } catch (error) {
             console.error(`Failed to fetch recently viewed product with id ${id}`, error);
          }
        }
        setRecentlyViewedProducts(products);
      };
      fetchProducts();
    } else {
        setRecentlyViewedProducts([]);
    }
  }, [productIds, hydrated]);


  const addProduct = useCallback((productId: string) => {
    setProductIds(prevIds => {
      const newIds = [productId, ...prevIds.filter(id => id !== productId)];
      return newIds.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  return { recentlyViewedProducts, addProduct, hydrated };
}
