-- Add a SELECT policy that blocks all reads via RLS (admins can access via service role or dashboard)
-- This prevents public access to customer inquiries data

CREATE POLICY "Block public select on inquiries"
ON public.inquiries
FOR SELECT
USING (false);