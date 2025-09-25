-- Setup MATPASS Packages for Supabase
-- Execute this in your Supabase SQL Editor: https://supabase.com/dashboard/project/hwxrstqeuouefyrwjsjt/sql

-- 1. Create currencies table (if not exists)
CREATE TABLE IF NOT EXISTS currencies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(5) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  exchange_rate DECIMAL(10, 6) DEFAULT 1.000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create session_durations table (if not exists)
CREATE TABLE IF NOT EXISTS session_durations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create package_definitions table (if not exists)
CREATE TABLE IF NOT EXISTS package_definitions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sessions_count INTEGER NOT NULL,
  session_duration_id INTEGER NOT NULL,
  package_type VARCHAR(20) NOT NULL,
  max_group_size INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_duration_id) REFERENCES session_durations(id) ON DELETE CASCADE
);

-- 4. Create package_prices table (if not exists)
CREATE TABLE IF NOT EXISTS package_prices (
  id SERIAL PRIMARY KEY,
  package_definition_id INTEGER NOT NULL,
  currency_id INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  pricing_mode VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (package_definition_id) REFERENCES package_definitions(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_id) REFERENCES currencies(id) ON DELETE CASCADE,
  UNIQUE(package_definition_id, currency_id)
);

-- Insert PEN currency (Peruvian Sol)
INSERT INTO currencies (code, name, symbol, is_default) VALUES
('PEN', 'Peruvian Sol', 'S/.', true)
ON CONFLICT (code) DO NOTHING;

-- Insert 1-hour session duration
INSERT INTO session_durations (name, duration_minutes, description) VALUES
('1 Hour Session', 60, 'Standard 1-hour wellness class')
ON CONFLICT (id) DO NOTHING;

-- Insert MATPASS package definitions
INSERT INTO package_definitions (id, name, description, sessions_count, session_duration_id, package_type, max_group_size, is_active) VALUES
(1, '01 MATPASS', '1 session of 1 hour', 1, 1, 'individual', 1, true),
(2, '04 MATPASS', '4 sessions of 1 hour each', 4, 1, 'individual', 1, true),
(3, '08 MATPASS', '8 sessions of 1 hour each', 8, 1, 'individual', 1, true),
(4, '12 MATPASS', '12 sessions of 1 hour each', 12, 1, 'individual', 1, true),
(5, '24 MATPASS', '24 sessions of 1 hour each', 24, 1, 'individual', 1, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sessions_count = EXCLUDED.sessions_count,
  session_duration_id = EXCLUDED.session_duration_id,
  package_type = EXCLUDED.package_type,
  max_group_size = EXCLUDED.max_group_size,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Insert MATPASS package prices (Peruvian Sol)
INSERT INTO package_prices (package_definition_id, currency_id, price, pricing_mode, is_active) VALUES
(1, (SELECT id FROM currencies WHERE code = 'PEN'), 60.00, 'custom', true),
(2, (SELECT id FROM currencies WHERE code = 'PEN'), 190.00, 'custom', true),
(3, (SELECT id FROM currencies WHERE code = 'PEN'), 350.00, 'custom', true),
(4, (SELECT id FROM currencies WHERE code = 'PEN'), 420.00, 'custom', true),
(5, (SELECT id FROM currencies WHERE code = 'PEN'), 550.00, 'custom', true)
ON CONFLICT (package_definition_id, currency_id) DO UPDATE SET
  price = EXCLUDED.price,
  pricing_mode = EXCLUDED.pricing_mode,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_package_definitions_active ON package_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_package_prices_currency ON package_prices(currency_id);

-- Enable Row Level Security (RLS)
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_durations ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_prices ENABLE ROW LEVEL SECURITY;

-- Verify the data was inserted correctly
SELECT 
  pd.id,
  pd.name,
  pd.description,
  pd.sessions_count,
  sd.duration_minutes,
  c.symbol,
  pp.price
FROM package_definitions pd
JOIN session_durations sd ON pd.session_duration_id = sd.id
JOIN package_prices pp ON pd.id = pp.package_definition_id
JOIN currencies c ON pp.currency_id = c.id
WHERE pd.is_active = true AND pp.is_active = true
ORDER BY pd.id;
