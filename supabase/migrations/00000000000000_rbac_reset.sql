-- =============================================================================
-- Faculty Management System — Full RBAC Reset
-- Run once in Supabase SQL Editor. Drops old schema and recreates with RLS.
-- =============================================================================

-- Drop existing objects (order matters for FKs)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS faculty_config CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;

-- =============================================================================
-- Tables
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('research', 'club', 'event')),
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_url TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_applications_post_id ON applications(post_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);

-- =============================================================================
-- Enable RLS
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies
-- =============================================================================

-- Profiles: users can SELECT their own profile
CREATE POLICY "Users can select own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Posts: public SELECT
CREATE POLICY "Public can select posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Posts: admin full access
CREATE POLICY "Admin full access on posts"
  ON posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Applications: students INSERT where auth.uid() = student_id
CREATE POLICY "Students can insert own application"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Applications: students SELECT where auth.uid() = student_id
CREATE POLICY "Students can select own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- Applications: admin full access
CREATE POLICY "Admin full access on applications"
  ON applications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =============================================================================
-- Auto-create profile on signup (role = 'student')
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
