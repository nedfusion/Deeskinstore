/*
  # Integrate Admin System with Supabase Auth

  ## Problem
  Current admin authentication uses custom RPC function that doesn't create
  Supabase auth sessions. This causes RLS policies to fail because auth.uid()
  returns NULL when admins try to manage products.

  ## Solution
  1. Create Supabase auth users for admins
  2. Link admin records to auth.users via user_id foreign key
  3. Update admin creation to use Supabase auth
  4. Keep existing admin table for additional metadata

  ## Changes
  1. Add user_id column to admins table (links to auth.users)
  2. Create function to register admin with Supabase auth
  3. Update existing super admin to have Supabase auth account
  4. Create policy for admins table based on auth.uid()

  ## Security
  - Admins must authenticate through Supabase Auth
  - Admin metadata stored in admins table
  - RLS policies now work correctly with auth.uid()
*/

-- Add user_id column to link admins to auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE admins ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE UNIQUE INDEX IF NOT EXISTS admins_user_id_key ON admins(user_id);
  END IF;
END $$;

-- Function to create admin with Supabase auth
CREATE OR REPLACE FUNCTION create_admin_with_auth(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text DEFAULT 'admin'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_admin_id uuid;
  v_encrypted_password text;
BEGIN
  -- Create auth user
  v_user_id := extensions.uuid_generate_v4();
  v_encrypted_password := extensions.crypt(p_password, extensions.gen_salt('bf'));

  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    p_email,
    v_encrypted_password,
    now(),
    now(),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', p_full_name),
    'authenticated',
    'authenticated'
  );

  -- Create identity
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    extensions.uuid_generate_v4(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object('sub', v_user_id::text, 'email', p_email),
    'email',
    now(),
    now(),
    now()
  );

  -- Create or update admin record
  INSERT INTO admins (email, user_id, password_hash, full_name, role, is_active)
  VALUES (p_email, v_user_id, hash_password(p_password), p_full_name, p_role, true)
  ON CONFLICT (email)
  DO UPDATE SET
    user_id = v_user_id,
    password_hash = hash_password(p_password),
    full_name = p_full_name,
    role = p_role,
    updated_at = now()
  RETURNING id INTO v_admin_id;

  RETURN v_user_id;
END;
$$;

-- Update existing super admin to have Supabase auth account
DO $$
DECLARE
  v_admin record;
  v_user_id uuid;
BEGIN
  -- Get existing super admin
  SELECT * INTO v_admin FROM admins WHERE email = 'admin@deeskinstore.com';

  IF v_admin.id IS NOT NULL AND v_admin.user_id IS NULL THEN
    -- Create auth user for existing admin
    BEGIN
      v_user_id := create_admin_with_auth(
        'admin@deeskinstore.com',
        'admin123',
        'Super Administrator',
        'super_admin'
      );

      RAISE NOTICE 'Created Supabase auth account for admin@deeskinstore.com';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Admin auth account may already exist';
    END;
  END IF;
END $$;

-- Update RLS policies for admins table to use user_id
DROP POLICY IF EXISTS "Admins can view all admins" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;

-- Allow admins to view all admin records
CREATE POLICY "Authenticated admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Allow super admins to manage admin records
CREATE POLICY "Super admins can manage all admins"
  ON admins FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  );

-- Update product policies to use user_id
DROP POLICY IF EXISTS "Only admins can create products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- Allow active admins to insert products
CREATE POLICY "Authenticated admins can create products"
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

-- Allow active admins to update products
CREATE POLICY "Authenticated admins can update products"
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

-- Allow active admins to delete products
CREATE POLICY "Authenticated admins can delete products"
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

-- Update other admin policies to use user_id
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Authenticated admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

CREATE POLICY "Authenticated admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Authenticated admins can update all orders"
  ON orders FOR UPDATE
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

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Authenticated admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;

CREATE POLICY "Authenticated admins can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Authenticated admins can update all reviews"
  ON reviews FOR UPDATE
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

CREATE POLICY "Authenticated admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );