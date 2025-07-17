import type { Product, ProductSpecification, ProductDocumentation, Compliance } from '@/lib/types';
import { seriesOptions } from './types';

// A robust sanitizer that ensures a raw database row conforms to the Product type.
// This is the single source of truth for converting database rows to Product objects.
export function sanitizeProduct(row: any): Product {
  if (!row) {
    // This case should ideally be handled before calling sanitizeProduct,
    // but as a safeguard, we return a mostly empty product structure.
    // This prevents downstream components from crashing if they receive an undefined product.
    return {
      id: '',
      name: 'Unknown Product',
      sku: 'N/A',
      series: 'Silver',
      description: '',
      standard_features: '',
      images: [],
      specifications: [],
      documentation: [],
      compliance: [],
      related_products: [],
      tags: [],
    };
  }
  
  return {
    id: row.id || '',
    name: row.name || 'Untitled Product',
    sku: row.sku || '',
    series: seriesOptions.includes(row.series) ? row.series : 'Silver',
    description: row.description || '',
    standard_features: row.standard_features || '',
    
    // Crucially, ensure all fields expected to be arrays are arrays,
    // converting from null or other types if necessary.
    images: Array.isArray(row.images) ? row.images : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    documentation: Array.isArray(row.documentation) ? row.documentation : [],
    compliance: Array.isArray(row.compliance) ? row.compliance : [],
    related_products: Array.isArray(row.related_products) ? row.related_products : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}
