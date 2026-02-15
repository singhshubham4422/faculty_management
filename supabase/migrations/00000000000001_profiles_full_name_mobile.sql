-- =============================================================================
-- Add full_name and mobile to profiles (student-facing)
-- Students can update their own profile; role logic unchanged.
-- =============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS mobile TEXT;

-- Students/admins can update their own profile (e.g. full_name, mobile)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
