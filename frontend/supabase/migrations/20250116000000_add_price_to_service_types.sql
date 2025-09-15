-- Add price and currency fields to service_types table
-- This migration adds price and currency support to service types

-- Add price and currency_id columns to service_types table
ALTER TABLE service_types 
ADD COLUMN price DECIMAL(10, 2),
ADD COLUMN currency_id INTEGER;

-- Add foreign key constraint for currency
ALTER TABLE service_types 
ADD CONSTRAINT fk_service_types_currency 
FOREIGN KEY (currency_id) REFERENCES currencies(id) 
ON DELETE SET NULL ON UPDATE RESTRICT;

-- Create index for currency_id
CREATE INDEX IF NOT EXISTS idx_service_types_currency 
ON service_types(currency_id);

-- Add some sample data for existing service types (optional)
-- You can uncomment and modify this section if you want to set default prices
-- UPDATE service_types 
-- SET price = 50.00, currency_id = 1 
-- WHERE price IS NULL AND currency_id IS NULL;
