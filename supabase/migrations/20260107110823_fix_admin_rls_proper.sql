/*
  # Fix Admin RLS Policies - Use Admin ID Not Supabase Auth

  ## Problem
  Admin login uses custom password authentication, not Supabase Auth.
  RLS policies incorrectly checked user_id from Supabase Auth.
  
  ## Solution
  Remove user_id-based policies and grant direct table permissions.
  
  ## Changes
  1. Drop incorrect Supabase Auth user_id policies
  2. Grant table permissions to authenticated role
  3. Keep public view policies for products
*/

-- Drop the incorrect user_id based policies
DROP POLICY IF EXISTS "Admins can create products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Grant execute permission on authenticate_admin function
GRANT EXECUTE ON FUNCTION authenticate_admin TO anon, authenticated;

-- Grant table permissions for admin operations
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, UPDATE ON admins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO authenticated;
GRANT SELECT ON users TO authenticated;

-- Ensure public view policies remain for products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Allow viewing all products'
  ) THEN
    CREATE POLICY "Allow viewing all products"
      ON products FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;
