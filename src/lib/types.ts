
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

export const seriesOptions = ['-', 'Silver', 'Royal', 'Diamond', 'MasterTap'] as const;

export const allTags = [
  'Air Switches', 'Alchemy', 'Bar Sinks', 'Beer Systems', 'Beverage Dispensing', 
  'Bottle Coolers', 'Casters', 'Direct Draw Coolers', 'Dispensing Faucets', 'Drainboards', 
  'Drainers & Rinsers', 'Drains', 'Dry Storage Cabinets', 'Dump Sinks', 'Electric', 
  'Electric Sensor Faucets', 'Faucets', 'Foodservice', 'Freezers', 'Gas Connectors', 'Gas Systems', 
  'Glass Chiller', 'Glass Washer', 'Hand Sinks', 'Home', 'Hose Reels', 'HydroSift', 
  'Ice Bin', 'Kits', 'Liquor Displays', 'Locking Covers', 'Mixology', 
  'Mop Floor Sinks', 'MoveWell', 'Mug Froster', 'Parts & Accessories', 'Pass Thru Units', 
  'Perforated Inserts', 'Pet Grooming', 'Plumbing', 'Pot Fillers', 'Power Packs', 
  'Pre-Rinse Units', 'Refrigeration', 'Regulator Panels', 'Remote', 'Robotic Bartenders', 
  'Sinks', 'Soap Dispensers', 'Soda Gun Holders', 'Specialized Stations', 
  'Speed Units', 'Spouts', 'Stations', 'Storage Cabinets', 'Towers', 'Trash Chute', 
  'Trunk Lines', 'Underbar', 'Utility', 'Vinyl Wrap', 'Water Filters', 'Workstations'
] as const;

// This type now reflects the structure of the `products` table in your database
export interface Product {
  id: string; // uuid
  sku: string;
  name: string;
  series: (typeof seriesOptions)[number];
  description: string;
  images: string[]; // TEXT[] in postgres
  specifications: ProductSpecification[]; // JSONB
  documentation: ProductDocumentation[]; // JSONB
  related_products: string[]; // TEXT[] for product IDs
  standard_features?: string;
  compliance?: Compliance[]; // JSONB
  tags?: string[]; // TEXT[]
}
