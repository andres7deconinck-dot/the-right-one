ALTER TABLE public.saved_restaurants
ADD COLUMN IF NOT EXISTS venue_type text NOT NULL DEFAULT 'restaurant';
