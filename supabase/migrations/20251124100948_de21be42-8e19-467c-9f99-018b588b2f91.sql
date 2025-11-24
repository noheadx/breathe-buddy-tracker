-- Add condition and dose tracking fields to peak_flow_entries
ALTER TABLE public.peak_flow_entries 
ADD COLUMN condition text,
ADD COLUMN morning_dose integer,
ADD COLUMN evening_dose integer;

-- Add default dose settings to user_settings
ALTER TABLE public.user_settings
ADD COLUMN default_morning_dose integer DEFAULT 0,
ADD COLUMN default_evening_dose integer DEFAULT 0;