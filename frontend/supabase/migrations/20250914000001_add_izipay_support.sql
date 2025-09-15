-- Migration: Add Izipay Payment Support
-- Adds PEN currency and Izipay payment method configuration

-- Add Peruvian Sol (PEN) currency if it doesn't exist
INSERT INTO currencies (code, name, symbol, is_default, exchange_rate) 
SELECT 'PEN', 'Peruvian Sol', 'S/', false, 3.750000
WHERE NOT EXISTS (SELECT 1 FROM currencies WHERE code = 'PEN');

-- Add Izipay payment method configuration
INSERT INTO payment_method_configs (name, type, description, icon, requires_confirmation, auto_assign_package, is_active) 
SELECT 
  'Izipay', 
  'izipay', 
  'Pago con tarjeta de crédito/débito a través de Izipay (Perú)', 
  '💳', 
  false, 
  true, 
  true
WHERE NOT EXISTS (SELECT 1 FROM payment_method_configs WHERE name = 'Izipay');

-- Update Peru in supported countries for Stripe config modal (if needed)
-- This is handled in the frontend component

-- Create index for Izipay payment method type
CREATE INDEX IF NOT EXISTS idx_payment_method_configs_izipay ON payment_method_configs(type) WHERE type = 'izipay';

-- Add comment to document the Izipay integration
COMMENT ON TABLE payment_method_configs IS 'Payment methods configuration table with support for various payment types including Izipay for Peru';

-- Create a view for active payment methods with currency information (optional)
CREATE OR REPLACE VIEW active_payment_methods AS
SELECT 
  pmc.id,
  pmc.name,
  pmc.type,
  pmc.description,
  pmc.icon,
  pmc.requires_confirmation,
  pmc.auto_assign_package,
  pmc.is_active,
  pmc.created_at,
  pmc.updated_at
FROM payment_method_configs pmc
WHERE pmc.is_active = true
ORDER BY pmc.name;

-- Grant permissions for the view
GRANT SELECT ON active_payment_methods TO authenticated;
GRANT SELECT ON active_payment_methods TO anon;

-- Add provider_config JSONB column to payment_method_configs if not exists
ALTER TABLE payment_method_configs
ADD COLUMN IF NOT EXISTS provider_config JSONB;

-- Backfill default provider_config for Izipay if entry exists
UPDATE payment_method_configs
SET provider_config = COALESCE(provider_config, jsonb_build_object(
  'merchantId', '',
  'username', '',
  'password', '',
  'publicKey', '',
  'currency', 'PEN',
  'environment', 'sandbox',
  'supportedCountries', jsonb_build_array('PE'),
  'returnUrl', '/payment/success',
  'cancelUrl', '/payment/cancel'
))
WHERE type = 'izipay';
