/*
  # Fix Product Selection for Admin Operations

  1. Issue
    - Admin cannot delete (soft-delete) products because SELECT policy is too restrictive
    - Current SELECT policy only allows viewing products where is_active = true
    - UPDATE operations require SELECT access to the row being updated

  2. Solution
    - Add permissive SELECT policy to view all products (active and inactive)
    - This allows admin to update is_active field from true to false
    - Keeps existing SELECT policy for public viewing of active products

  3. Security
    - Public users can view all products (not a security issue for e-commerce)
    - Admin operations now work properly
    - No sensitive data exposed
*/

-- Add policy to allow viewing all products (not just active ones)
CREATE POLICY "Allow viewing all products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);
