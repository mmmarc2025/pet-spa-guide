
-- 1. Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS store_name text;

-- 2. Update Role Check Constraint to support 'store' and 'groomer'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('owner', 'provider', 'admin', 'store', 'groomer'));

-- 3. Helper function to check admin status safely (Security Definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. Allow Admins to update any profile (for approval/rejection)
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE
  USING ( public.is_admin() );

-- 5. Allow Admins to view all profiles (implicit usually, but explicit is good if we tighten 'select')
-- The existing policy "Public profiles are viewable by everyone" handles SELECT for now.
