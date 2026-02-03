
-- Promote the latest user to admin for testing
UPDATE public.users 
SET role = 'admin', is_verified = true 
WHERE id = (
    SELECT id FROM public.users 
    ORDER BY created_at DESC 
    LIMIT 1
);
