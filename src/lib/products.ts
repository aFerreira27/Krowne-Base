import { products as initialProducts } from './data';
import type { Product } from './types';

const getStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const stored = localStorage.getItem('krowne_products');
  return stored ? JSON.parse(stored) : [];
};

const getAllProducts = (): Product[] => {
  const storedProducts = getStoredProducts();
  const combined = [...initialProducts, ...storedProducts];
  // Remove duplicates, giving precedence to stored products
  const uniqueProducts = Array.from(new Map(combined.map(p => [p.id, p])).values());
  return uniqueProducts;
};

export function getProducts(query?: string): Product[] {
  let products = getAllProducts();
  
  if (query) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  return products;
}

export function getProductById(id: string): Product | undefined {
  const products = getAllProducts();
  return products.find(p => p.id === id);
}

export function addProduct(productData: Omit<Product, 'id' | 'images' | 'relatedProducts'> & { images: { url: string }[] }) {
    if (typeof window === 'undefined') return;

    const newProduct: Product = {
        ...productData,
        id: new Date().getTime().toString(), // Simple unique ID
        images: productData.images.map(img => img.url),
        relatedProducts: [],
        description: productData.description || '',
        documentation: productData.documentation || [],
    };

    const storedProducts = getStoredProducts();
    const updatedProducts = [...storedProducts, newProduct];
    localStorage.setItem('krowne_products', JSON.stringify(updatedProducts));
}
