export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductDocumentation {
  name: string;
  url: string;
}

export interface Compliance {
    name: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  images: string[];
  specifications: ProductSpecification[];
  documentation: ProductDocumentation[];
  relatedProducts: string[]; // array of product IDs
  standardFeatures?: string;
  compliance?: Compliance[];
}
