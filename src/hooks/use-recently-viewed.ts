
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products';

const RECENTLY_VIEWED_KEY = 'krowne_recently_viewed';
const MAX_RECENT_ITEMS = 5;

export function useRecentlyViewed() {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  useEffect(() => {
    if (hydrated) {
        try {
            window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(productIds));
        } catch (error) {
            console.error("Failed to save recently viewed items to localStorage", error);
        }
    }
  }, [productIds, hydrated]);

  const addProduct = useCallback((productId: string) => {
    setProductIds(prevIds => {
      const newIds = [productId, ...prevIds.filter(id => id !== productId)];
      return newIds.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  const recentlyViewedProducts: Product[] = hydrated ? productIds.map(id => getProductById(id)).filter((p): p is Product => !!p) : [];

  return { recentlyViewedProducts, addProduct, hydrated };
}
