-- 005_user_achievements_schema.sql
-- Purpose: Ensure the user_achievements table, indexes, and RLS policies exist.
-- Safe/idempotent: uses IF NOT EXISTS and conditional creation for policies.

-- 1) Ensure required extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Create table if missing
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id varchar(100) NOT NULL,
  unlocked_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, achievement_id)
);

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- 4) Enable Row Level Security
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 5) Policies (create only if not present)
DO $$
BEGIN
  -- Select own rows
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_achievements'
      AND policyname = 'ua_select_own'
  ) THEN
    CREATE POLICY ua_select_own
    ON public.user_achievements
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  -- Insert own rows
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_achievements'
      AND policyname = 'ua_insert_own'
  ) THEN
    CREATE POLICY ua_insert_own
    ON public.user_achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update own rows (needed for upsert conflict updates)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_achievements'
      AND policyname = 'ua_update_own'
  ) THEN
    CREATE POLICY ua_update_own
    ON public.user_achievements
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$ LANGUAGE plpgsql;

-- Optionally allow deletes of own rows (commented out)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_policies p
--     JOIN pg_class c ON p.polrelid = c.oid
--     JOIN pg_namespace n ON c.relnamespace = n.oid
--     WHERE p.polname = 'ua_delete_own' AND n.nspname = 'public' AND c.relname = 'user_achievements'
--   ) THEN
--     CREATE POLICY ua_delete_own
--     ON public.user_achievements
--     FOR DELETE
--     USING (auth.uid() = user_id);
--   END IF;
-- END $$;

-- 6) Notes:
-- - After applying this migration on Supabase, go to Settings -> API and Reset API cache
--   so PostgREST picks up the new/updated schema.
-- - Ensure the users table exists and is RLS-enabled appropriately.