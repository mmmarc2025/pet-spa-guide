
-- 1. Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    line_user_id TEXT UNIQUE,
    display_name TEXT,
    picture_url TEXT,
    role TEXT DEFAULT 'owner', -- owner, groomer, admin
    email TEXT,
    phone TEXT,
    last_login_at TIMESTAMPTZ
);

-- 2. Create user_sessions table for custom auth
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- 3. Enable RLS (Row Level Security) - Optional but recommended
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (Allow Edge Function full access via service role, but restrict public)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (true);
    END IF;
END
$$;

-- 5. Grant permissions to service_role and anon (if needed)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_sessions TO service_role;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO authenticated;
