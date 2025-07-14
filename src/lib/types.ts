export interface ProductSpecification {
  key: string;
  value: string;
}

export const docTypeOptions = ["Spec Sheet", "3D Drawing", "2D Drawing", "Other"] as const;

export interface ProductDocumentation {
  type: (typeof docTypeOptions)[number];
  url: string;
}

export interface Compliance {
    name: string;
}

export const seriesOptions = ['Silver', 'Royal', 'Diamond', 'MasterTap'] as const;

export interface Product {
  id: string;
  sku: string;
  name: string;
  series: (typeof seriesOptions)[number];
  description: string;
  images: string[];
  specifications: ProductSpecification[];
  documentation: ProductDocumentation[];
  relatedProducts: string[]; // array of product IDs
  standardFeatures?: string;
  compliance?: Compliance[];
}
