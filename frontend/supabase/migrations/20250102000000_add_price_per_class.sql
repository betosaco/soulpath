-- Add price_per_class column to package_prices table
-- This allows storing the price per class as a database value instead of calculating it

ALTER TABLE package_prices 
ADD COLUMN IF NOT EXISTS price_per_class DECIMAL(10, 2);

-- Update existing package prices with calculated price per class values
UPDATE package_prices 
SET price_per_class = ROUND(price / (
  SELECT sessions_count 
  FROM package_definitions 
  WHERE package_definitions.id = package_prices.package_definition_id
), 2)
WHERE price_per_class IS NULL;

-- Add comment to the column
COMMENT ON COLUMN package_prices.price_per_class IS 'Price per individual class/session, calculated from total price divided by sessions count';
