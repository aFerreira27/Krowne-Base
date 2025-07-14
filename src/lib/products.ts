import { products as allProducts } from './data';
import type { Product } from './types';

export function getProducts(query?: string): Product[] {
  if (!query) {
    return allProducts;
  }
  return allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}
