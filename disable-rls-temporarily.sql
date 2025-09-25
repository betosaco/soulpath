-- Temporarily disable RLS to test database access
-- Execute this in your Supabase SQL Editor

-- Disable RLS on all tables
ALTER TABLE currencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_durations DISABLE ROW LEVEL SECURITY;
ALTER TABLE package_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE package_prices DISABLE ROW LEVEL SECURITY;

-- Grant usage on public schema to anonymous role
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select permissions on all tables to anonymous role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Verify the changes
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('currencies', 'session_durations', 'package_definitions', 'package_prices');
