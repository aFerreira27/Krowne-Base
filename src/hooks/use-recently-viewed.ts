
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products-client'; // We need a client-side fetcher

const RECENTLY_VIEWED_KEY = 'krowne_recently_viewed';
const MAX_RECENT_ITEMS = 5;

// Basic UUID regex check
const isUUID = (id: string) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
};

export function useRecentlyViewed() {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load IDs from localStorage on initial mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
      const ids = item ? JSON.parse(item) : [];
      // Filter for valid UUIDs right away
      const validIds = Array.isArray(ids) ? ids.filter(id => typeof id === 'string' && isUUID(id)) : [];
      setProductIds(validIds);
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
        // The IDs are already validated, so we can proceed
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
    // Ensure we only add valid UUIDs
    if (!isUUID(productId)) return;
    
    setProductIds(prevIds => {
      const newIds = [productId, ...prevIds.filter(id => id !== productId)];
      return newIds.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  return { recentlyViewedProducts, addProduct, hydrated };
}
