-- ============================================================================
-- TEACHER RELATIONSHIP TABLES MIGRATION
-- Adds the missing relationship tables for teacher specialties and languages
-- ============================================================================

-- 1. Create specialties table
-- ============================================================================
CREATE TABLE IF NOT EXISTS specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for specialties table
CREATE INDEX IF NOT EXISTS idx_specialties_active ON specialties(is_active);
CREATE INDEX IF NOT EXISTS idx_specialties_category ON specialties(category);

-- 2. Create languages table
-- ============================================================================
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- ISO 639-1 code (e.g., 'en', 'es')
    native_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for languages table
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);

-- 3. Create teacher_specialties junction table
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_specialties (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    specialty_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, specialty_id)
);

-- Create indexes for teacher_specialties table
CREATE INDEX IF NOT EXISTS idx_teacher_specialties_teacher ON teacher_specialties(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_specialties_specialty ON teacher_specialties(specialty_id);

-- 4. Create teacher_languages junction table
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_languages (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL,
    language_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, language_id)
);

-- Create indexes for teacher_languages table
CREATE INDEX IF NOT EXISTS idx_teacher_languages_teacher ON teacher_languages(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_languages_language ON teacher_languages(language_id);

-- 5. Update teachers table to remove old array columns and add new fields
-- ============================================================================

-- First, let's add the new columns that are missing from the teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS short_bio VARCHAR(500);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS teaching_style TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS philosophy TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS approach TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 10;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS min_students INTEGER DEFAULT 1;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS preferred_times TEXT[] DEFAULT '{}';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500);

-- 6. Insert some default specialties
-- ============================================================================
INSERT INTO specialties (name, description, category, is_active, display_order) VALUES
('Hatha Yoga', 'Gentle, slow-paced yoga focusing on basic postures and breathing', 'Yoga', true, 1),
('Vinyasa Yoga', 'Dynamic, flowing yoga connecting breath with movement', 'Yoga', true, 2),
('Ashtanga Yoga', 'Rigorous, structured yoga with a set sequence of postures', 'Yoga', true, 3),
('Yin Yoga', 'Slow, meditative yoga holding poses for extended periods', 'Yoga', true, 4),
('Meditation', 'Mindfulness and meditation practices', 'Mindfulness', true, 5),
('Pranayama', 'Breathing exercises and techniques', 'Breathing', true, 6),
('Pilates', 'Low-impact exercise focusing on core strength and flexibility', 'Fitness', true, 7),
('Tai Chi', 'Gentle martial art combining movement and meditation', 'Martial Arts', true, 8),
('Qi Gong', 'Ancient Chinese practice combining movement, breathing, and meditation', 'Energy Work', true, 9),
('Sound Healing', 'Therapeutic use of sound and vibration for healing', 'Healing', true, 10)
ON CONFLICT (name) DO NOTHING;

-- 7. Insert some default languages
-- ============================================================================
INSERT INTO languages (name, code, native_name, is_active, display_order) VALUES
('English', 'en', 'English', true, 1),
('Spanish', 'es', 'Español', true, 2),
('French', 'fr', 'Français', true, 3),
('German', 'de', 'Deutsch', true, 4),
('Italian', 'it', 'Italiano', true, 5),
('Portuguese', 'pt', 'Português', true, 6),
('Russian', 'ru', 'Русский', true, 7),
('Chinese', 'zh', '中文', true, 8),
('Japanese', 'ja', '日本語', true, 9),
('Korean', 'ko', '한국어', true, 10)
ON CONFLICT (code) DO NOTHING;

-- 8. Migrate existing data from old array columns to new relationship tables
-- ============================================================================

-- Migrate specialties from the old TEXT[] column to the new relationship table
-- This is a best-effort migration - we'll try to match existing specialty names
DO $$
DECLARE
    teacher_record RECORD;
    specialty_name TEXT;
    specialty_id INTEGER;
BEGIN
    FOR teacher_record IN SELECT id, specialties FROM teachers WHERE specialties IS NOT NULL AND array_length(specialties, 1) > 0 LOOP
        FOREACH specialty_name IN ARRAY teacher_record.specialties LOOP
            -- Try to find or create the specialty
            SELECT id INTO specialty_id FROM specialties WHERE name = specialty_name;
            
            IF specialty_id IS NULL THEN
                -- Create the specialty if it doesn't exist
                INSERT INTO specialties (name, is_active, display_order) 
                VALUES (specialty_name, true, 999)
                RETURNING id INTO specialty_id;
            END IF;
            
            -- Create the relationship if it doesn't exist
            INSERT INTO teacher_specialties (teacher_id, specialty_id)
            VALUES (teacher_record.id, specialty_id)
            ON CONFLICT (teacher_id, specialty_id) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Migrate languages from the old TEXT[] column to the new relationship table
DO $$
DECLARE
    teacher_record RECORD;
    language_name TEXT;
    language_id INTEGER;
BEGIN
    FOR teacher_record IN SELECT id, languages FROM teachers WHERE languages IS NOT NULL AND array_length(languages, 1) > 0 LOOP
        FOREACH language_name IN ARRAY teacher_record.languages LOOP
            -- Try to find the language by name or create a mapping
            SELECT id INTO language_id FROM languages WHERE name = language_name OR native_name = language_name;
            
            IF language_id IS NULL THEN
                -- Create the language if it doesn't exist
                INSERT INTO languages (name, code, is_active, display_order) 
                VALUES (language_name, lower(substring(language_name, 1, 2)), true, 999)
                RETURNING id INTO language_id;
            END IF;
            
            -- Create the relationship if it doesn't exist
            INSERT INTO teacher_languages (teacher_id, language_id)
            VALUES (teacher_record.id, language_id)
            ON CONFLICT (teacher_id, language_id) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 9. Add comments to document the tables
-- ============================================================================
COMMENT ON TABLE specialties IS 'Available teaching specialties and disciplines';
COMMENT ON TABLE languages IS 'Supported languages for teaching';
COMMENT ON TABLE teacher_specialties IS 'Many-to-many relationship between teachers and specialties';
COMMENT ON TABLE teacher_languages IS 'Many-to-many relationship between teachers and languages';

-- Success message
SELECT 'Teacher relationship tables created successfully!' as message;
