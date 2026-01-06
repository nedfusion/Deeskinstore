/*
  # Fix Critical Product Security Vulnerability

  ## Problem
  Previous migration created policies allowing ANYONE (including anonymous users)
  to create, update, and delete products. This is a critical security vulnerability.

  ## Changes
  1. Drop all dangerous "Anyone can..." policies on products table
  2. Create secure admin-only policies that verify admin authentication
  3. Keep public read-only access for active products
  4. Ensure only authenticated admins can manage products

  ## Security
  - ✅ Public users can ONLY view active products (read-only)
  - ✅ Only authenticated users in the admins table can create products
  - ✅ Only authenticated users in the admins table can update products
  - ✅ Only authenticated users in the admins table can delete products
  - ✅ Admin verification checks both authentication AND active status
*/

-- Drop the dangerous policies that allow anyone to manage products
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Create secure admin-only policies for product management

-- Allow only active admins to insert products
CREATE POLICY "Only admins can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Allow only active admins to update products
CREATE POLICY "Only admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Allow only active admins to delete products
CREATE POLICY "Only admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Verify the existing public read policy is still in place
-- (This should already exist from the initial schema migration)
-- If it doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'products'
    AND policyname = 'Anyone can view active products'
  ) THEN
    CREATE POLICY "Anyone can view active products"
      ON products FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;
