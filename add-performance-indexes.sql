-- ============================================================================
-- PERFORMANCE INDEXES FOR WELLNESS MONOREPO
-- ============================================================================
-- Run this script in your Supabase SQL Editor to add performance indexes
-- These indexes will significantly improve query performance for your APIs
-- ============================================================================

-- PACKAGES API OPTIMIZATION
-- For packages query (active + displayOrder)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_package_definition_active_order 
ON "PackageDefinition" (is_active, display_order) 
WHERE is_active = true;

COMMENT ON INDEX idx_package_definition_active_order IS 
'Optimizes /api/packages queries filtering by active status and ordering by display_order';

-- ============================================================================

-- PRODUCTS API OPTIMIZATION
-- For products query (status + createdAt for sorting)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_status_created 
ON "Product" (status, created_at DESC) 
WHERE status = 'ACTIVE';

COMMENT ON INDEX idx_product_status_created IS 
'Optimizes /api/products queries filtering by status and ordering by creation date';

-- For products search by name (case-insensitive)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_name_trgm 
ON "Product" USING gin (name gin_trgm_ops);

COMMENT ON INDEX idx_product_name_trgm IS 
'Enables fast text search on product names using trigram matching';

-- For products category filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_category_status 
ON "Product" (category, status) 
WHERE status = 'ACTIVE';

COMMENT ON INDEX idx_product_category_status IS 
'Optimizes /api/products queries filtering by category and active status';

-- ============================================================================

-- SCHEDULE SLOTS API OPTIMIZATION
-- For schedule slots query (startTime + isAvailable)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schedule_slots_time_available 
ON "TeacherScheduleSlot" (start_time, is_available) 
WHERE is_available = true;

COMMENT ON INDEX idx_schedule_slots_time_available IS 
'Optimizes /api/teacher-schedule-slots queries filtering by time range and availability';

-- For schedule slots with late flag
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schedule_slots_late 
ON "TeacherScheduleSlot" (is_late, start_time) 
WHERE is_late = true OR is_late IS NULL;

COMMENT ON INDEX idx_schedule_slots_late IS 
'Optimizes queries for late notification slots';

-- Composite index for common schedule queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_schedule_slots_composite 
ON "TeacherScheduleSlot" (start_time, is_available, booked_count, max_bookings);

COMMENT ON INDEX idx_schedule_slots_composite IS 
'Composite index for complex schedule queries including booking counts';

-- ============================================================================

-- PACKAGE PRICES OPTIMIZATION
-- For package prices query (active + currency)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_package_prices_active_currency 
ON "PackagePrice" (is_active, currency_id, package_definition_id) 
WHERE is_active = true;

COMMENT ON INDEX idx_package_prices_active_currency IS 
'Optimizes package price lookups by currency and active status';

-- ============================================================================

-- BOOKINGS OPTIMIZATION
-- For user bookings query
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_status 
ON "Booking" (user_id, status, created_at DESC);

COMMENT ON INDEX idx_bookings_user_status IS 
'Optimizes user bookings queries with status filtering';

-- For teacher bookings query
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_slot_status 
ON "Booking" (teacher_schedule_slot_id, status);

COMMENT ON INDEX idx_bookings_slot_status IS 
'Optimizes bookings lookup by schedule slot and status';

-- ============================================================================

-- USER PACKAGES OPTIMIZATION
-- For active user packages
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_packages_active 
ON "UserPackage" (user_id, is_active, expiry_date) 
WHERE is_active = true;

COMMENT ON INDEX idx_user_packages_active IS 
'Optimizes active user package queries with expiry date filtering';

-- ============================================================================

-- TEACHER SCHEDULE OPTIMIZATION
-- For teacher schedule lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_teacher_schedule_composite 
ON "TeacherSchedule" (teacher_id, service_type_id, venue_id, is_active) 
WHERE is_active = true;

COMMENT ON INDEX idx_teacher_schedule_composite IS 
'Optimizes teacher schedule queries with multiple filters';

-- ============================================================================

-- ENABLE pg_trgm EXTENSION FOR TEXT SEARCH
-- Required for the gin_trgm_ops index on product names
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================

-- ANALYZE TABLES TO UPDATE STATISTICS
-- This helps the query planner choose the best indexes
ANALYZE "PackageDefinition";
ANALYZE "Product";
ANALYZE "TeacherScheduleSlot";
ANALYZE "PackagePrice";
ANALYZE "Booking";
ANALYZE "UserPackage";
ANALYZE "TeacherSchedule";

-- ============================================================================

-- VERIFY INDEXES WERE CREATED
-- Run this query to see all the new indexes
SELECT 
    schemaname,
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================================

-- CHECK INDEX USAGE (run after some time to verify indexes are being used)
-- This query shows which indexes are being used most frequently
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY idx_scan DESC;

-- ============================================================================
-- END OF PERFORMANCE INDEXES SCRIPT
-- ============================================================================
