-- Add welcome_shown column to user_preferences table
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS welcome_shown BOOLEAN DEFAULT FALSE;
