/*
  # Restore Working Admin and Fix Product RLS Policies

  ## Problems Fixed
  1. Admin login using Supabase Auth with proper user_id linkage
  2. Product update RLS policy allowing admins to edit products
  3. Product delete RLS policy allowing admins to delete products
  
  ## Changes
  1. Drop and recreate conflicting RLS policies on products table
  2. Ensure product policies work with Supabase Auth user_id
  3. Verify admin can perform all CRUD operations on products
  
  ## Security
  - Only authenticated admin users can create, update, or delete products
  - Public users can only view active products
  - Admin verification done through admins table with user_id check
*/

-- Drop existing product policies that might conflict
DROP POLICY IF EXISTS "Authenticated admins can create products" ON products;
DROP POLICY IF EXISTS "Authenticated admins can update products" ON products;
DROP POLICY IF EXISTS "Authenticated admins can delete products" ON products;

-- Recreate product policies with proper admin authorization
CREATE POLICY "Admins can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Note: The public view policies remain unchanged
