
-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can read published themes" ON themes;
DROP POLICY IF EXISTS "Only admins can create themes" ON themes;
DROP POLICY IF EXISTS "Only admins can update themes" ON themes;

-- Re-create the RLS policies with proper syntax
CREATE POLICY "Anyone can read published themes" 
ON themes FOR SELECT 
TO anon, authenticated
USING (status = 'published');

-- Only authenticated users with admin role can insert themes
CREATE POLICY "Only admins can create themes" 
ON themes FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_super_admin(auth.uid()));

-- Only authenticated users with admin role can update themes
CREATE POLICY "Only admins can update themes" 
ON themes FOR UPDATE 
TO authenticated
USING (is_admin_or_super_admin(auth.uid()))
WITH CHECK (is_admin_or_super_admin(auth.uid()));

-- Only authenticated users with admin role can delete themes
CREATE POLICY "Only admins can delete themes" 
ON themes FOR DELETE 
TO authenticated
USING (is_admin_or_super_admin(auth.uid()));
