-- Restrict direct execution of has_role; keep it usable by RLS for authenticated users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Add ip_address column to inquiries for persistent rate limiting
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS ip_address text;
CREATE INDEX IF NOT EXISTS idx_inquiries_ip_created ON public.inquiries (ip_address, created_at DESC);