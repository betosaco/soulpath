-- Check current state and fix permissions
-- Execute this in your Supabase SQL Editor

-- Check if tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');

-- Check permissions
SELECT grantee, table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');

-- Fix permissions - grant access to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Disable RLS temporarily
ALTER TABLE currencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_durations DISABLE ROW LEVEL SECURITY;
ALTER TABLE package_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE package_prices DISABLE ROW LEVEL SECURITY;

-- Check data in tables
SELECT COUNT(*) as currencies_count FROM currencies;
SELECT COUNT(*) as session_durations_count FROM session_durations;
SELECT COUNT(*) as package_definitions_count FROM package_definitions;
SELECT COUNT(*) as package_prices_count FROM package_prices;
