import { products as initialProducts } from './data';
import type { Product } from './types';
import { neon } from '@neondatabase/serverless';
import { docTypeOptions, seriesOptions } from './types';

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

export function addProduct(productData: Omit<Product, 'id' | 'images' | 'relatedProducts' | 'documentation'> & { images: { url: string }[] } & { documentation: { type: (typeof docTypeOptions)[number], url: string }[] }) {
    if (typeof window === 'undefined') return;

    const newProduct: Product = {
        ...productData,
        id: new Date().getTime().toString(), // Simple unique ID
        images: productData.images.map(img => img.url),
        relatedProducts: [],
        description: productData.description || '',
        documentation: productData.documentation || [],
        compliance: productData.compliance || [],
        series: productData.series || seriesOptions[0],
    };

    const storedProducts = getStoredProducts();
    const updatedProducts = [...storedProducts, newProduct];
    localStorage.setItem('krowne_products', JSON.stringify(updatedProducts));
}


export function updateProduct(id: string, productData: Omit<Product, 'id' | 'images' | 'relatedProducts' | 'documentation'> & { images: { url: string }[] } & { documentation: { type: (typeof docTypeOptions)[number], url: string }[] }) {
  if (typeof window === 'undefined') return;

  const productToUpdate: Product = {
    ...productData,
    id,
    images: productData.images.map(img => img.url),
    relatedProducts: getProductById(id)?.relatedProducts || [],
    description: productData.description || '',
    documentation: productData.documentation || [],
    compliance: productData.compliance || [],
    series: productData.series || seriesOptions[0],
  };

  const storedProducts = getStoredProducts();
  const updatedProducts = storedProducts.map(p => p.id === id ? productToUpdate : p);
  
  // Also check initial products in case we are editing one of them
  const initialExists = initialProducts.some(p => p.id === id);
  if (initialExists && !storedProducts.some(p => p.id === id)) {
     // it's an initial product that hasn't been edited before, add it to stored
     updatedProducts.push(productToUpdate);
  } else if (!initialExists && !storedProducts.some(p => p.id === id)) {
      // This case should ideally not happen if called from edit page
      console.warn("updateProduct called for a product that does not exist");
      return;
  }
  
  localStorage.setItem('krowne_products', JSON.stringify(updatedProducts));
}

export function clearProducts() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('krowne_products');
}
