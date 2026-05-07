
-- Extend trips table
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS destination_country text,
  ADD COLUMN IF NOT EXISTS destination_city text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'planning';

-- Backfill destination_country from existing destination if null
UPDATE public.trips
  SET destination_country = COALESCE(destination_country, destination)
  WHERE destination_country IS NULL;

-- saved_restaurants
CREATE TABLE IF NOT EXISTS public.saved_restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  restaurant_id text NOT NULL,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, restaurant_id)
);
ALTER TABLE public.saved_restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own saved restaurants"
  ON public.saved_restaurants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_restaurants_user ON public.saved_restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_restaurants_trip ON public.saved_restaurants(trip_id);

-- trip_checklist_items
CREATE TABLE IF NOT EXISTS public.trip_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  label text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trip_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage checklist for own trips"
  ON public.trip_checklist_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_id AND t.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_id AND t.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_checklist_trip ON public.trip_checklist_items(trip_id);

-- Trigger: seed default checklist items on new trip
CREATE OR REPLACE FUNCTION public.seed_trip_checklist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.trip_checklist_items (trip_id, label, sort_order) VALUES
    (NEW.id, 'Download translation cards offline', 1),
    (NEW.id, 'Read country guide for destination', 2),
    (NEW.id, 'Research hospital locations at destination', 3),
    (NEW.id, 'Pack GF snacks for travel day', 4),
    (NEW.id, 'Print emergency allergy card', 5),
    (NEW.id, 'Save emergency phrases offline', 6),
    (NEW.id, 'Notify airline of dietary requirements', 7),
    (NEW.id, 'Research GF supermarkets near accommodation', 8);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_seed_trip_checklist ON public.trips;
CREATE TRIGGER trg_seed_trip_checklist
  AFTER INSERT ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.seed_trip_checklist();
