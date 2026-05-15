ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS display_author text;

-- Backfill: set display_author for the Aqua Fantasy article
UPDATE public.blog_posts
SET display_author = 'Aqua Fantasy Aquapark Hotel & Spa'
WHERE hotel_name ILIKE '%Aqua Fantasy%' AND display_author IS NULL;
