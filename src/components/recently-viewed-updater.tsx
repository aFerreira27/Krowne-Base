
'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';

interface RecentlyViewedUpdaterProps {
  productId: string;
}

export function RecentlyViewedUpdater({ productId }: RecentlyViewedUpdaterProps) {
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (productId) {
      addProduct(productId);
    }
  }, [productId, addProduct]);

  return null; // This component does not render anything
}
