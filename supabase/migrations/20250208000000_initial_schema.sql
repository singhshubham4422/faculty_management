-- Faculty Management System - Initial Schema
-- Run this migration in your Supabase SQL Editor or via Supabase CLI
--
-- Note: For admin RLS to work, faculty_config.id must match the Supabase Auth user id
-- when faculty sign in. Create Auth users and insert corresponding faculty_config rows.

-- 1. faculty_config table
CREATE TABLE faculty_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL
);

-- 2. posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('research', 'club')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  student_name TEXT,
  email TEXT,
  mobile TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster lookups on applications by post_id
CREATE INDEX idx_applications_post_id ON applications(post_id);

-- Helper function to check if current user is admin (exists in faculty_config)
-- Uses SECURITY DEFINER to bypass RLS when checking faculty_config
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM faculty_config WHERE id = auth.uid()
  );
$$;

-- Enable Row Level Security on all tables
ALTER TABLE faculty_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Applications: Anyone can insert (including unauthenticated users)
CREATE POLICY "Anyone can insert applications"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Posts: Only admin can read
CREATE POLICY "Only admin can read posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Applications: Only admin can read
CREATE POLICY "Only admin can read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Optional: Allow admin to manage posts (insert, update, delete)
CREATE POLICY "Only admin can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admin can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admin can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (is_admin());
