

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

export const complianceGroups = {
  "NSF": [
    "NSF St. 61",
    "NSF/ANSI 372",
    "NSF/ANSI/CAN 61: Q < 1",
    "NSF/ANSI 169"
  ],
  "CSA": [
    "ASME A112.18.1/CSA B125.1",
    "ASME A112.18.2/CSA B125.2",
    "NSF/ANSI 372",
    "ANSI Z21.69/CSA 6.16",
    "ANSI Z21.24/ CSA 6.10",
    "CSA B64.1.1-2011"
  ],
  "Intertek AKA ETL": [
    "NSF St. 7",
    "UL 471",
    "CSA C22.2#120"
  ],
  "ASSE": [
    "1001"
  ],
  "UL": [
    "UL1951"
  ],
  "IAPMO": [
    "NSF/ANSI 61"
  ]
};

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
