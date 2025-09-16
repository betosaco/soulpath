-- Create specialties table
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

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    native_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- Create indexes for languages table
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);

-- Create teacher_specialties junction table
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

-- Create teacher_languages junction table
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

-- Insert some default specialties
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

-- Insert some default languages
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
