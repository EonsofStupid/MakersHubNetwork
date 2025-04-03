
-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can read published themes" ON themes;
DROP POLICY IF EXISTS "Only admins can create themes" ON themes;
DROP POLICY IF EXISTS "Only admins can update themes" ON themes;
DROP POLICY IF EXISTS "Only admins can delete themes" ON themes;

-- Re-create the RLS policies with proper syntax
CREATE POLICY "Anyone can read published themes" 
ON themes FOR SELECT 
TO anon, authenticated
USING (status = 'published' OR is_default = true);

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

-- Create policies for theme components 
DROP POLICY IF EXISTS "Anyone can read theme components" ON theme_components;
DROP POLICY IF EXISTS "Only admins can create theme components" ON theme_components;
DROP POLICY IF EXISTS "Only admins can update theme components" ON theme_components;
DROP POLICY IF EXISTS "Only admins can delete theme components" ON theme_components;

CREATE POLICY "Anyone can read theme components" 
ON theme_components FOR SELECT 
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM themes 
  WHERE themes.id = theme_components.theme_id 
  AND (themes.status = 'published' OR themes.is_default = true)
));

CREATE POLICY "Only admins can create theme components" 
ON theme_components FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Only admins can update theme components" 
ON theme_components FOR UPDATE 
TO authenticated
USING (is_admin_or_super_admin(auth.uid()))
WITH CHECK (is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Only admins can delete theme components" 
ON theme_components FOR DELETE 
TO authenticated
USING (is_admin_or_super_admin(auth.uid()));
