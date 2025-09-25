-- Fix RLS policies for packages API access
-- Execute this in your Supabase SQL Editor

-- Allow anonymous read access to currencies
CREATE POLICY "Allow anonymous read access to currencies" ON currencies
FOR SELECT USING (true);

-- Allow anonymous read access to session_durations
CREATE POLICY "Allow anonymous read access to session_durations" ON session_durations
FOR SELECT USING (true);

-- Allow anonymous read access to package_definitions
CREATE POLICY "Allow anonymous read access to package_definitions" ON package_definitions
FOR SELECT USING (true);

-- Allow anonymous read access to package_prices
CREATE POLICY "Allow anonymous read access to package_prices" ON package_prices
FOR SELECT USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');
