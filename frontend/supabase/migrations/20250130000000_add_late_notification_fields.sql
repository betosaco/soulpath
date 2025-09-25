-- Add late notification fields to teacher_schedule_slots table
ALTER TABLE teacher_schedule_slots 
ADD COLUMN is_late BOOLEAN DEFAULT FALSE,
ADD COLUMN late_minutes INTEGER DEFAULT 0,
ADD COLUMN late_message TEXT,
ADD COLUMN late_notified_at TIMESTAMPTZ,
ADD COLUMN original_start_time TIMESTAMPTZ,
ADD COLUMN original_end_time TIMESTAMPTZ;

-- Add indexes for late notification queries
CREATE INDEX idx_teacher_schedule_slots_is_late ON teacher_schedule_slots(is_late);
CREATE INDEX idx_teacher_schedule_slots_late_notified_at ON teacher_schedule_slots(late_notified_at);

-- Add comments for documentation
COMMENT ON COLUMN teacher_schedule_slots.is_late IS 'Indicates if the teacher is running late for this slot';
COMMENT ON COLUMN teacher_schedule_slots.late_minutes IS 'Number of minutes the teacher is late';
COMMENT ON COLUMN teacher_schedule_slots.late_message IS 'Optional message from teacher about being late';
COMMENT ON COLUMN teacher_schedule_slots.late_notified_at IS 'When the late notification was sent';
COMMENT ON COLUMN teacher_schedule_slots.original_start_time IS 'Original start time before late adjustment';
COMMENT ON COLUMN teacher_schedule_slots.original_end_time IS 'Original end time before late adjustment';
