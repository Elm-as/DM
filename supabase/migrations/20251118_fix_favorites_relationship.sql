-- Migration: Ensure favorites table links to listings for profile queries
-- Date: 2025-11-18

-- 0) Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1) Rename legacy product_id column if needed
DO $$
DECLARE
  has_listing_id BOOLEAN;
  has_product_id BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'favorites'
      AND column_name = 'listing_id'
  ) INTO has_listing_id;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'favorites'
      AND column_name = 'product_id'
  ) INTO has_product_id;

  IF NOT has_listing_id AND has_product_id THEN
    ALTER TABLE public.favorites RENAME COLUMN product_id TO listing_id;
  END IF;
END $$;

-- 2) Ensure required columns are NOT NULL and exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'favorites' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.favorites ADD COLUMN user_id uuid;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'favorites' AND column_name = 'listing_id'
  ) THEN
    ALTER TABLE public.favorites ADD COLUMN listing_id uuid;
  END IF;
  ALTER TABLE public.favorites ALTER COLUMN user_id SET NOT NULL;
  ALTER TABLE public.favorites ALTER COLUMN listing_id SET NOT NULL;
END $$;

-- 3) (Re)create the foreign keys so PostgREST can discover the relationship
ALTER TABLE public.favorites
  DROP CONSTRAINT IF EXISTS favorites_listing_id_fkey;
ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_listing_id_fkey
  FOREIGN KEY (listing_id)
  REFERENCES public.listings(id)
  ON DELETE CASCADE;

ALTER TABLE public.favorites
  DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- 4) Unique pair and indexes
DO $$
DECLARE
  uniq_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.table_schema='public' AND tc.table_name='favorites' AND tc.constraint_type='UNIQUE' AND tc.constraint_name='favorites_user_listing_unique'
  ) INTO uniq_exists;
  IF NOT uniq_exists THEN
    ALTER TABLE public.favorites
      ADD CONSTRAINT favorites_user_listing_unique UNIQUE (user_id, listing_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON public.favorites(listing_id);

-- 5) Enable RLS & policies
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='favorites' AND policyname='Users can read own favorites') THEN
    DROP POLICY "Users can read own favorites" ON public.favorites;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='favorites' AND policyname='Users can insert own favorites') THEN
    DROP POLICY "Users can insert own favorites" ON public.favorites;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='favorites' AND policyname='Users can delete own favorites') THEN
    DROP POLICY "Users can delete own favorites" ON public.favorites;
  END IF;
END $$;

CREATE POLICY "Users can read own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
