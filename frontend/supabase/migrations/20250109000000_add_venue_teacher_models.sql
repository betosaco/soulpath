-- ============================================================================
-- VENUE AND TEACHER MODELS MIGRATION
-- Adds venue and teacher models with scheduling capabilities
-- ============================================================================

-- 1. Create venues table
-- ============================================================================
CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    capacity INTEGER NOT NULL DEFAULT 10,
    max_group_size INTEGER,
    amenities TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for venues table
CREATE INDEX IF NOT EXISTS idx_venues_active ON venues(is_active);
CREATE INDEX IF NOT EXISTS idx_venues_order ON venues(display_order);
CREATE INDEX IF NOT EXISTS idx_venues_featured ON venues(featured);

-- 2. Create teachers table
-- ============================================================================
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    experience INTEGER DEFAULT 0,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    venue_id INTEGER REFERENCES venues(id) ON DELETE SET NULL ON UPDATE RESTRICT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for teachers table
CREATE INDEX IF NOT EXISTS idx_teachers_active ON teachers(is_active);
CREATE INDEX IF NOT EXISTS idx_teachers_order ON teachers(display_order);
CREATE INDEX IF NOT EXISTS idx_teachers_featured ON teachers(featured);
CREATE INDEX IF NOT EXISTS idx_teachers_venue ON teachers(venue_id);

-- 3. Create teacher_schedules table
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_schedules (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    venue_id INTEGER NOT NULL REFERENCES venues(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    day_of_week VARCHAR(20) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_bookings INTEGER DEFAULT 1,
    specialties TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for teacher_schedules table
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_teacher ON teacher_schedules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_venue ON teacher_schedules(venue_id);
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_day ON teacher_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_teacher_schedules_available ON teacher_schedules(is_available);

-- 4. Create teacher_schedule_slots table
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_schedule_slots (
    id SERIAL PRIMARY KEY,
    teacher_schedule_id INTEGER NOT NULL REFERENCES teacher_schedules(id) ON DELETE CASCADE ON UPDATE RESTRICT,
    start_time TIMESTAMPTZ(6) NOT NULL,
    end_time TIMESTAMPTZ(6) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booked_count INTEGER DEFAULT 0,
    max_bookings INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for teacher_schedule_slots table
CREATE INDEX IF NOT EXISTS idx_teacher_schedule_slots_start_time ON teacher_schedule_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_teacher_schedule_slots_available_start_time ON teacher_schedule_slots(is_available, start_time);
CREATE INDEX IF NOT EXISTS idx_teacher_schedule_slots_end_time ON teacher_schedule_slots(end_time);
CREATE INDEX IF NOT EXISTS idx_teacher_schedule_slots_available ON teacher_schedule_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_teacher_schedule_slots_booked_count ON teacher_schedule_slots(booked_count);

-- 5. Update package_definitions table
-- ============================================================================
ALTER TABLE package_definitions 
ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;

-- Create index for is_global field
CREATE INDEX IF NOT EXISTS idx_package_definitions_global ON package_definitions(is_global);

-- 6. Update schedule_templates table
-- ============================================================================
ALTER TABLE schedule_templates 
ADD COLUMN IF NOT EXISTS venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE ON UPDATE RESTRICT;

-- Create index for venue_id field
CREATE INDEX IF NOT EXISTS idx_schedule_templates_venue ON schedule_templates(venue_id);

-- 7. Update bookings table
-- ============================================================================
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS teacher_schedule_slot_id INTEGER REFERENCES teacher_schedule_slots(id) ON DELETE CASCADE ON UPDATE RESTRICT,
ADD COLUMN IF NOT EXISTS venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE ON UPDATE RESTRICT,
ADD COLUMN IF NOT EXISTS teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE RESTRICT;

-- Make schedule_slot_id optional (for teacher-specific bookings)
ALTER TABLE bookings 
ALTER COLUMN schedule_slot_id DROP NOT NULL;

-- Create indexes for new booking fields
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_schedule_slot_id ON bookings(teacher_schedule_slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_teacher_id ON bookings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_teacher ON bookings(venue_id, teacher_id);

-- 8. Add comments for documentation
-- ============================================================================
COMMENT ON TABLE venues IS 'Venues where wellness sessions are conducted';
COMMENT ON TABLE teachers IS 'Teachers/instructors who conduct wellness sessions';
COMMENT ON TABLE teacher_schedules IS 'Weekly schedule templates for teachers at specific venues';
COMMENT ON TABLE teacher_schedule_slots IS 'Specific time slots for teacher availability';
COMMENT ON COLUMN package_definitions.is_global IS 'Whether package can be used across all venues and teachers';
COMMENT ON COLUMN bookings.teacher_schedule_slot_id IS 'For teacher-specific bookings';
COMMENT ON COLUMN bookings.venue_id IS 'Venue where the booking takes place';
COMMENT ON COLUMN bookings.teacher_id IS 'Teacher assigned to the booking';

-- 9. Insert sample data
-- ============================================================================

-- Insert sample venues
INSERT INTO venues (name, description, address, city, country, capacity, max_group_size, amenities, is_active, display_order, featured) VALUES
('Main Studio', 'Our primary wellness studio with modern equipment', '123 Wellness St', 'Lima', 'Peru', 15, 8, ARRAY['yoga mats', 'meditation cushions', 'sound system'], true, 1, true),
('Garden Pavilion', 'Outdoor wellness space surrounded by nature', '456 Garden Ave', 'Lima', 'Peru', 12, 6, ARRAY['outdoor mats', 'nature sounds', 'fresh air'], true, 2, false),
('Private Room', 'Intimate space for one-on-one sessions', '789 Private Lane', 'Lima', 'Peru', 2, 2, ARRAY['privacy', 'personalized setup'], true, 3, false);

-- Insert sample teachers
INSERT INTO teachers (name, email, phone, bio, specialties, languages, experience, is_active, display_order, featured, venue_id) VALUES
('Maria Santos', 'maria@soulpath.lat', '+51-987-654-321', 'Certified yoga instructor with 10+ years experience', ARRAY['Hatha Yoga', 'Meditation', 'Breathing Techniques'], ARRAY['Spanish', 'English'], 10, true, 1, true, 1),
('Carlos Rodriguez', 'carlos@soulpath.lat', '+51-987-654-322', 'Mindfulness and stress management specialist', ARRAY['Mindfulness', 'Stress Relief', 'Guided Meditation'], ARRAY['Spanish', 'English'], 8, true, 2, true, 1),
('Ana Gutierrez', 'ana@soulpath.lat', '+51-987-654-323', 'Pilates and movement therapy expert', ARRAY['Pilates', 'Movement Therapy', 'Posture Correction'], ARRAY['Spanish'], 6, true, 3, false, 2);

-- Insert sample teacher schedules
INSERT INTO teacher_schedules (teacher_id, venue_id, day_of_week, start_time, end_time, is_available, max_bookings, specialties) VALUES
(1, 1, 'Monday', '09:00', '17:00', true, 3, ARRAY['Hatha Yoga', 'Meditation']),
(1, 1, 'Wednesday', '09:00', '17:00', true, 3, ARRAY['Hatha Yoga', 'Meditation']),
(1, 1, 'Friday', '09:00', '17:00', true, 3, ARRAY['Hatha Yoga', 'Meditation']),
(2, 1, 'Tuesday', '10:00', '18:00', true, 2, ARRAY['Mindfulness', 'Stress Relief']),
(2, 1, 'Thursday', '10:00', '18:00', true, 2, ARRAY['Mindfulness', 'Stress Relief']),
(3, 2, 'Monday', '08:00', '16:00', true, 2, ARRAY['Pilates', 'Movement Therapy']),
(3, 2, 'Wednesday', '08:00', '16:00', true, 2, ARRAY['Pilates', 'Movement Therapy']),
(3, 2, 'Friday', '08:00', '16:00', true, 2, ARRAY['Pilates', 'Movement Therapy']);

-- Update existing schedule templates to reference venues
UPDATE schedule_templates SET venue_id = 1 WHERE venue_id IS NULL;

-- 10. Create helpful views
-- ============================================================================

-- View for available teacher slots
CREATE OR REPLACE VIEW available_teacher_slots AS
SELECT 
    tss.id as slot_id,
    tss.start_time,
    tss.end_time,
    tss.is_available,
    tss.booked_count,
    tss.max_bookings,
    t.name as teacher_name,
    t.specialties as teacher_specialties,
    v.name as venue_name,
    v.capacity as venue_capacity,
    ts.day_of_week,
    ts.specialties as schedule_specialties
FROM teacher_schedule_slots tss
JOIN teacher_schedules ts ON tss.teacher_schedule_id = ts.id
JOIN teachers t ON ts.teacher_id = t.id
JOIN venues v ON ts.venue_id = v.id
WHERE tss.is_available = true 
AND t.is_active = true 
AND v.is_active = true
AND tss.booked_count < tss.max_bookings;

-- View for venue capacity overview
CREATE OR REPLACE VIEW venue_capacity_overview AS
SELECT 
    v.id as venue_id,
    v.name as venue_name,
    v.capacity,
    v.max_group_size,
    COUNT(DISTINCT t.id) as total_teachers,
    COUNT(DISTINCT ts.id) as total_schedules,
    COUNT(DISTINCT tss.id) as total_slots
FROM venues v
LEFT JOIN teachers t ON v.id = t.venue_id AND t.is_active = true
LEFT JOIN teacher_schedules ts ON v.id = ts.venue_id AND ts.is_available = true
LEFT JOIN teacher_schedule_slots tss ON ts.id = tss.teacher_schedule_id AND tss.is_available = true
WHERE v.is_active = true
GROUP BY v.id, v.name, v.capacity, v.max_group_size;

-- 11. Add constraints
-- ============================================================================

-- Ensure at least one of schedule_slot_id or teacher_schedule_slot_id is provided
ALTER TABLE bookings 
ADD CONSTRAINT check_booking_slot 
CHECK (
    (schedule_slot_id IS NOT NULL AND teacher_schedule_slot_id IS NULL) OR 
    (schedule_slot_id IS NULL AND teacher_schedule_slot_id IS NOT NULL)
);

-- Ensure venue_id is provided when teacher_schedule_slot_id is provided
ALTER TABLE bookings 
ADD CONSTRAINT check_teacher_booking_venue 
CHECK (
    (teacher_schedule_slot_id IS NULL) OR 
    (teacher_schedule_slot_id IS NOT NULL AND venue_id IS NOT NULL)
);

-- 12. Update existing data
-- ============================================================================

-- Set all existing packages as global by default
UPDATE package_definitions SET is_global = true WHERE is_global IS NULL;

-- Update existing bookings to have venue_id from schedule_slot
UPDATE bookings 
SET venue_id = (
    SELECT st.venue_id 
    FROM schedule_slots ss 
    JOIN schedule_templates st ON ss.schedule_template_id = st.id 
    WHERE ss.id = bookings.schedule_slot_id
)
WHERE schedule_slot_id IS NOT NULL AND venue_id IS NULL;

-- Set venue_id to 1 for bookings without venue (fallback)
UPDATE bookings SET venue_id = 1 WHERE venue_id IS NULL;
