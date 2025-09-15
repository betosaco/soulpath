-- ============================================================================
-- SERVICE TYPES MIGRATION
-- Adds service types and package-service relationships
-- ============================================================================

-- 1. Create service_types table
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- class, workshop, training_program
    duration INTEGER DEFAULT 60, -- duration in minutes
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    requirements TEXT[] DEFAULT '{}', -- equipment, level, etc.
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    color VARCHAR(7), -- hex color for UI
    icon VARCHAR(50), -- icon name
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for service_types table
CREATE INDEX IF NOT EXISTS idx_service_types_category ON service_types(category);
CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_order ON service_types(display_order);
CREATE INDEX IF NOT EXISTS idx_service_types_featured ON service_types(featured);

-- 2. Create package_services table
-- ============================================================================
CREATE TABLE IF NOT EXISTS package_services (
    id SERIAL PRIMARY KEY,
    package_definition_id INTEGER NOT NULL REFERENCES package_definitions(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    service_type_id INTEGER NOT NULL REFERENCES service_types(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    sessions_included INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    UNIQUE(package_definition_id, service_type_id)
);

-- Create indexes for package_services table
CREATE INDEX IF NOT EXISTS idx_package_services_package ON package_services(package_definition_id);
CREATE INDEX IF NOT EXISTS idx_package_services_service ON package_services(service_type_id);

-- 3. Update teacher_schedules table
-- ============================================================================
ALTER TABLE teacher_schedules 
ADD COLUMN IF NOT EXISTS service_type_id INTEGER REFERENCES service_types(id) ON DELETE SET NULL ON UPDATE RESTRICT;

-- Create index for service_type_id field
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_service_type ON teacher_schedules(service_type_id);

-- 4. Update bookings table
-- ============================================================================
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS service_type_id INTEGER REFERENCES service_types(id) ON DELETE SET NULL ON UPDATE RESTRICT;

-- Create indexes for new booking fields
CREATE INDEX IF NOT EXISTS idx_bookings_service_type_id ON bookings(service_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_service ON bookings(teacher_id, service_type_id);

-- 5. Add comments for documentation
-- ============================================================================
COMMENT ON TABLE service_types IS 'Types of services offered (classes, workshops, training programs)';
COMMENT ON TABLE package_services IS 'Relationship between packages and service types';
COMMENT ON COLUMN service_types.category IS 'Type of service: class, workshop, training_program';
COMMENT ON COLUMN service_types.duration IS 'Duration in minutes';
COMMENT ON COLUMN service_types.requirements IS 'Equipment, skill level, or other requirements';
COMMENT ON COLUMN service_types.color IS 'Hex color code for UI display';
COMMENT ON COLUMN service_types.icon IS 'Icon name for UI display';
COMMENT ON COLUMN package_services.sessions_included IS 'Number of sessions of this service type included in the package';

-- 6. Insert sample service types
-- ============================================================================

-- Yoga Classes
INSERT INTO service_types (name, description, category, duration, max_participants, min_participants, requirements, is_active, display_order, featured, color, icon) VALUES
('Hatha Yoga', 'Gentle yoga practice focusing on basic postures and breathing', 'class', 60, 15, 1, ARRAY['yoga mat', 'comfortable clothes'], true, 1, true, '#8BC34A', 'yoga'),
('Vinyasa Flow', 'Dynamic yoga practice linking breath with movement', 'class', 75, 12, 1, ARRAY['yoga mat', 'water bottle'], true, 2, true, '#4CAF50', 'yoga'),
('Yin Yoga', 'Slow-paced yoga with long-held poses for deep relaxation', 'class', 90, 10, 1, ARRAY['yoga mat', 'blanket', 'bolster'], true, 3, false, '#66BB6A', 'yoga'),
('Power Yoga', 'Intense yoga practice building strength and flexibility', 'class', 60, 8, 1, ARRAY['yoga mat', 'towel', 'water bottle'], true, 4, false, '#388E3C', 'yoga');

-- Meditation Classes
INSERT INTO service_types (name, description, category, duration, max_participants, min_participants, requirements, is_active, display_order, featured, color, icon) VALUES
('Mindfulness Meditation', 'Guided meditation focusing on present moment awareness', 'class', 45, 20, 1, ARRAY['cushion', 'comfortable clothes'], true, 5, true, '#2196F3', 'meditation'),
('Breathing Techniques', 'Learn various breathing exercises for stress relief', 'class', 30, 15, 1, ARRAY['comfortable clothes'], true, 6, false, '#03A9F4', 'breath'),
('Loving-Kindness Meditation', 'Cultivate compassion and loving-kindness through meditation', 'class', 60, 18, 1, ARRAY['cushion', 'blanket'], true, 7, false, '#00BCD4', 'heart');

-- Workshops
INSERT INTO service_types (name, description, category, duration, max_participants, min_participants, requirements, is_active, display_order, featured, color, icon) VALUES
('Stress Management Workshop', 'Learn practical techniques to manage daily stress', 'workshop', 120, 25, 5, ARRAY['notebook', 'pen'], true, 8, true, '#FF9800', 'workshop'),
('Chakra Balancing Workshop', 'Introduction to chakra system and balancing techniques', 'workshop', 180, 20, 8, ARRAY['yoga mat', 'crystal set'], true, 9, false, '#9C27B0', 'crystal'),
('Nutrition for Wellness', 'Learn about nutrition and its impact on mental health', 'workshop', 150, 30, 10, ARRAY['notebook', 'pen'], true, 10, false, '#4CAF50', 'nutrition');

-- Training Programs
INSERT INTO service_types (name, description, category, duration, max_participants, min_participants, requirements, is_active, display_order, featured, color, icon) VALUES
('200-Hour Yoga Teacher Training', 'Comprehensive yoga teacher certification program', 'training_program', 4800, 15, 8, ARRAY['yoga mat', 'notebooks', 'textbooks'], true, 11, true, '#E91E63', 'graduation-cap'),
('Meditation Instructor Course', 'Learn to teach meditation and mindfulness practices', 'training_program', 2400, 12, 6, ARRAY['cushions', 'teaching materials'], true, 12, false, '#673AB7', 'book'),
('Wellness Coach Certification', 'Become a certified wellness and life coach', 'training_program', 3600, 20, 10, ARRAY['laptop', 'study materials'], true, 13, false, '#3F51B5', 'award');

-- 7. Create sample package-service relationships
-- ============================================================================

-- Get package and service IDs for relationships
-- Note: These will be created when packages exist in the database
-- For now, we'll create a view to show how to create these relationships

CREATE OR REPLACE VIEW package_service_examples AS
SELECT 
    pd.id as package_id,
    pd.name as package_name,
    st.id as service_id,
    st.name as service_name,
    st.category,
    st.duration,
    CASE 
        WHEN st.category = 'class' THEN 10
        WHEN st.category = 'workshop' THEN 2
        WHEN st.category = 'training_program' THEN 1
        ELSE 5
    END as suggested_sessions_included
FROM package_definitions pd
CROSS JOIN service_types st
WHERE pd.is_active = true 
AND st.is_active = true
AND st.category = 'class'; -- Only classes for basic packages

-- 8. Create helpful views
-- ============================================================================

-- View for available services by category
CREATE OR REPLACE VIEW available_services_by_category AS
SELECT 
    st.category,
    COUNT(*) as total_services,
    COUNT(CASE WHEN st.is_active = true THEN 1 END) as active_services,
    AVG(st.duration) as avg_duration,
    MIN(st.min_participants) as min_participants,
    MAX(st.max_participants) as max_participants
FROM service_types st
GROUP BY st.category
ORDER BY st.category;

-- View for teacher service capabilities
CREATE OR REPLACE VIEW teacher_service_capabilities AS
SELECT 
    t.id as teacher_id,
    t.name as teacher_name,
    st.id as service_id,
    st.name as service_name,
    st.category,
    st.duration,
    ts.day_of_week,
    ts.start_time,
    ts.end_time,
    v.name as venue_name
FROM teachers t
JOIN teacher_schedules ts ON t.id = ts.teacher_id
JOIN service_types st ON ts.service_type_id = st.id
JOIN venues v ON ts.venue_id = v.id
WHERE t.is_active = true 
AND ts.is_available = true
AND st.is_active = true
ORDER BY t.name, st.category, ts.day_of_week;

-- View for package service offerings
CREATE OR REPLACE VIEW package_service_offerings AS
SELECT 
    pd.id as package_id,
    pd.name as package_name,
    pd.sessions_count,
    st.id as service_id,
    st.name as service_name,
    st.category,
    st.duration,
    ps.sessions_included,
    ps.is_active as service_active
FROM package_definitions pd
LEFT JOIN package_services ps ON pd.id = ps.package_definition_id
LEFT JOIN service_types st ON ps.service_type_id = st.id
WHERE pd.is_active = true
ORDER BY pd.name, st.category, st.name;

-- 9. Add constraints
-- ============================================================================

-- Ensure service type category is valid
ALTER TABLE service_types 
ADD CONSTRAINT check_service_category 
CHECK (category IN ('class', 'workshop', 'training_program'));

-- Ensure duration is positive
ALTER TABLE service_types 
ADD CONSTRAINT check_duration_positive 
CHECK (duration > 0);

-- Ensure max_participants is greater than min_participants
ALTER TABLE service_types 
ADD CONSTRAINT check_participants_range 
CHECK (max_participants IS NULL OR max_participants >= min_participants);

-- Ensure sessions_included is positive
ALTER TABLE package_services 
ADD CONSTRAINT check_sessions_positive 
CHECK (sessions_included > 0);

-- 10. Create sample package-service relationships
-- ============================================================================

-- This will be populated when packages exist
-- Example relationships (uncomment when packages are available):
/*
INSERT INTO package_services (package_definition_id, service_type_id, sessions_included, is_active)
SELECT 
    pd.id,
    st.id,
    CASE 
        WHEN st.category = 'class' THEN 10
        WHEN st.category = 'workshop' THEN 2
        WHEN st.category = 'training_program' THEN 1
        ELSE 5
    END,
    true
FROM package_definitions pd
CROSS JOIN service_types st
WHERE pd.is_active = true 
AND st.is_active = true
AND st.category = 'class';
*/
