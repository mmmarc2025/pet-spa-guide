
-- Add columns for Store and Groomer profiles
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS store_name TEXT,
ADD COLUMN IF NOT EXISTS store_address TEXT,        -- For Store
ADD COLUMN IF NOT EXISTS service_areas TEXT[],      -- For Groomer (e.g. ['Taipei_Daan', 'Taipei_Xinyi'])
ADD COLUMN IF NOT EXISTS bio TEXT,                  -- Introduction
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false, -- Admin approval
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- active, busy, offline

-- Add comment
COMMENT ON COLUMN public.users.service_areas IS 'Array of service area codes for Groomers';
