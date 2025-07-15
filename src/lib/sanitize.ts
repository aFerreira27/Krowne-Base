import type { Product } from '@/lib/types';

// A robust sanitizer that ensures a raw database row conforms to the Product type.
// This is the single source of truth for converting database rows to Product objects.
export function sanitizeProduct(row: any): Product {
  if (!row) {
    // This case should ideally be handled before calling sanitizeProduct,
    // but as a safeguard, we return a mostly empty product structure.
    return {
      id: '',
      name: '',
      sku: '',
      series: 'Silver',
      description: '',
      images: [],
      specifications: [],
      documentation: [],
      standard_features: '',
      compliance: [],
      related_products: [],
    };
  }
  
  return {
    id: row.id,
    name: row.name || '',
    sku: row.sku || '',
    series: row.series || 'Silver',
    description: row.description || '',
    standard_features: row.standard_features || '',
    // Ensure all array types are arrays, converting from null if necessary.
    images: Array.isArray(row.images) ? row.images : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    documentation: Array.isArray(row.documentation) ? row.documentation : [],
    compliance: Array.isArray(row.compliance) ? row.compliance : [],
    related_products: Array.isArray(row.related_products) ? row.related_products : [],
  };
}
