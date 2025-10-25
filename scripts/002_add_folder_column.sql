-- Add folder column to files table if it doesn't exist
ALTER TABLE public.files
ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'root';

-- Create index for faster folder queries
CREATE INDEX IF NOT EXISTS idx_files_user_folder ON public.files(user_id, folder);
