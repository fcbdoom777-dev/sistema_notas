-- Migration: Create users and grades tables with RLS policies
-- Run this in Supabase SQL editor or using supabase migrations

-- Create users table (profile linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY,
  name text,
  email text,
  role text CHECK (role IN ('student','teacher')),
  level text,
  grade text,
  created_at timestamptz DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
  id bigserial PRIMARY KEY,
  student_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  value numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Policies for public.users
-- Allow a user to INSERT their own profile (id must match authenticated uid)
CREATE POLICY "Insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow a user to SELECT their own profile
CREATE POLICY "Select own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow a user to UPDATE their own profile
CREATE POLICY "Update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow teachers (users with role = 'teacher' in public.users) to SELECT all profiles
CREATE POLICY "Teachers can select profiles" ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher'
    )
  );

-- Policies for public.grades
-- Allow students to INSERT their own grades (useful if students can record self assessments)
CREATE POLICY "Insert grade by owner or teacher" ON public.grades
  FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher')
  );

-- Allow student to SELECT their own grades, and teachers to SELECT all grades
CREATE POLICY "Select grades for owner or teacher" ON public.grades
  FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher')
  );

-- Allow teachers to UPDATE grades and students cannot update teacher-assigned grades
CREATE POLICY "Update grades by teacher" ON public.grades
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher'));

-- Allow teachers to DELETE grades
CREATE POLICY "Delete grades by teacher" ON public.grades
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'teacher'));

-- Optional: Grant select on public.users.email to ensure server-side operations can read emails when needed
GRANT SELECT (id, name, email, role, level, grade, created_at) ON public.users TO authenticated;

-- Note: If you prefer server-side creation of profiles (e.g., using service_role key),
-- you can create a DB function that inserts the profile and call it from a Netlify function.
