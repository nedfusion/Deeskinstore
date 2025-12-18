/*
  # Setup Admin Access and Seed Super Admin

  ## 1. Enable pgcrypto Extension
  - For password hashing

  ## 2. Create Admin Helper Functions
  - Function to verify admin credentials
  - Function to check admin permissions

  ## 3. Admin RLS Policies
  - Admins can manage all tables

  ## 4. Seed Super Admin
  - Create super admin user with credentials:
    - Email: admin@deeskinstore.com
    - Password: admin123
    - Role: super_admin
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to hash passwords
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify password
CREATE OR REPLACE FUNCTION verify_password(password text, password_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to authenticate admin
CREATE OR REPLACE FUNCTION authenticate_admin(p_email text, p_password text)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean
) AS $$
DECLARE
  admin_record admins%ROWTYPE;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record
  FROM admins
  WHERE admins.email = p_email
  AND admins.is_active = true;

  -- Check if admin exists and password matches
  IF admin_record.id IS NOT NULL AND verify_password(p_password, admin_record.password_hash) THEN
    -- Update last login
    UPDATE admins
    SET last_login = now()
    WHERE admins.id = admin_record.id;

    -- Return admin info
    RETURN QUERY
    SELECT 
      admin_record.id,
      admin_record.email,
      admin_record.full_name,
      admin_record.role,
      admin_record.is_active;
  ELSE
    -- Return empty result
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for users table
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Admin policies for products table
CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
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

-- Admin policies for orders table
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
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

-- Admin policies for order_items table
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Admin policies for reviews table
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update all reviews"
  ON reviews FOR UPDATE
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

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Admin policies for admins table (super_admin only)
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  );

-- Seed super admin user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@deeskinstore.com') THEN
    INSERT INTO admins (email, password_hash, full_name, role, is_active)
    VALUES (
      'admin@deeskinstore.com',
      hash_password('admin123'),
      'Super Administrator',
      'super_admin',
      true
    );
  END IF;
END $$;