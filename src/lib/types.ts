
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

export const allTags = [
  'Plumbing', 'Sinks', 'Faucets', 'Hand Sinks', 'Beer Systems', 'Underbar', 'Casters', 
  'Foodservice', 'Gas Connectors', 'Air Switches', 'Alchemy', 'Bar Sinks', 'Beverage Dispensing', 
  'Parts & Accessories', 'Kits', 'Bottle Coolers', 'Direct Draw Coolers', 'Dispensing Faucets', 
  'Drainboards', 'Drainers & Rinsers', 'Drains', 'Dry Storage Cabinets', 'Dump Sinks', 'Stations', 
  'Electric', 'Electric Sensor Faucets', 'Gas Systems', 'Glass Chiller', 'Glass Washer', 
  'Hose Reels', 'HydroSift', 'Water Filters', 'Ice Bin', 'Home', 'Liquor Displays', 
  'Locking Covers', 'Mixology', 'Mop Floor Sinks', 'MoveWell', 'Mug Froster', 'Freezers', 
  'Pass Thru Units', 'Perforated Inserts', 'Pet Grooming', 'Power Packs', 'Pre-Rinse Units', 
  'Refrigeration', 'Regulator Panels', 'Remote', 'Spouts', 'Robotic Bartenders', 'Soap Dispensers', 
  'Soda Gun Holders', 'Specialized Stations', 'Speed Units', 'Storage Cabinets', 'Towers', 
  'Trash Chute', 'Trunk Lines', 'Utility', 'Pot Fillers', 'Vinyl Wrap', 'Workstations'
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
