-- Enable the pgcrypto extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Define the custom enum type for product series
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_series') THEN
        CREATE TYPE product_series AS ENUM ('Silver', 'Royal', 'Diamond', 'MasterTap');
    END IF;
END$$;


-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    series product_series,
    description TEXT,
    standard_features TEXT,
    images TEXT[],
    specifications JSONB,
    documentation JSONB,
    compliance JSONB,
    related_products TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column on row update
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_timestamp' AND tgrelid = 'products'::regclass
    ) THEN
        CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();
    END IF;
END$$;

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_series ON products(series);

-- Add a full-text search index for better search performance
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || sku || ' ' || coalesce(description, '')));

-- Add a comment to the table for clarity
COMMENT ON TABLE products IS 'Stores all product information for the Krowne Base application.';
