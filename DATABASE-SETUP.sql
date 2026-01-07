-- ========================================
-- DEESKINSTORE DATABASE SETUP
-- Complete database schema and initial data
-- ========================================
--
-- INSTRUCTIONS:
-- 1. Create a new PostgreSQL database in Supabase
-- 2. Run this entire SQL file in the Supabase SQL Editor
-- 3. Update your .env file with your Supabase credentials
-- 4. The admin account will be created with:
--    Email: admin@deeskinstore.com
--    Password: admin123
--
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========================================
-- TABLES
-- ========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text DEFAULT '',
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  user_id uuid
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating numeric DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  email text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  order_id uuid REFERENCES orders(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ========================================
-- FUNCTIONS
-- ========================================

-- Function to hash passwords
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify password
CREATE OR REPLACE FUNCTION verify_password(password text, password_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate admin
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
  SELECT * INTO admin_record
  FROM admins
  WHERE admins.email = p_email
  AND admins.is_active = true;

  IF admin_record.id IS NOT NULL AND verify_password(p_password, admin_record.password_hash) THEN
    UPDATE admins
    SET last_login = now()
    WHERE admins.id = admin_record.id;

    RETURN QUERY
    SELECT
      admin_record.id,
      admin_record.email,
      admin_record.full_name,
      admin_record.role,
      admin_record.is_active;
  ELSE
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Products: Public can view active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Reviews: Public can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Order items: Users can view items from their orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ========================================
-- PERMISSIONS
-- ========================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION authenticate_admin TO anon, authenticated;
GRANT EXECUTE ON FUNCTION hash_password TO authenticated;
GRANT EXECUTE ON FUNCTION verify_password TO authenticated;

-- Grant table permissions for admin operations
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, UPDATE ON admins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE ON consultations TO authenticated;
GRANT SELECT ON users TO authenticated;

-- Grant permissions for anonymous users (public access)
GRANT SELECT ON products TO anon;
GRANT SELECT ON reviews TO anon;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;
GRANT INSERT ON consultations TO anon;

-- ========================================
-- SEED DATA
-- ========================================

-- Create super admin user
INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@deeskinstore.com',
  hash_password('admin123'),
  'Super Administrator',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = hash_password('admin123'),
    role = 'super_admin',
    is_active = true;

-- Sample products (you can add more as needed)
INSERT INTO products (name, description, price, image, category, stock, rating, is_active)
VALUES
  ('Kojic Acid Soap', 'Brightening soap that helps reduce dark spots and even skin tone', 3500, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800', 'Soaps & Cleansers', 50, 4.8, true),
  ('Vitamin C Serum', 'Powerful antioxidant serum that brightens and protects skin', 8500, 'https://images.pexels.com/photos/7428102/pexels-photo-7428102.jpeg?auto=compress&cs=tinysrgb&w=800', 'Serums & Treatments', 35, 4.9, true),
  ('Niacinamide Face Cream', 'Moisturizing cream with niacinamide to minimize pores and even skin tone', 6500, 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800', 'Moisturizers', 45, 4.7, true),
  ('Hyaluronic Acid Toner', 'Hydrating toner that plumps and moisturizes the skin', 5500, 'https://images.pexels.com/photos/6621403/pexels-photo-6621403.jpeg?auto=compress&cs=tinysrgb&w=800', 'Toners', 60, 4.6, true),
  ('Sunscreen SPF 50', 'Broad spectrum sunscreen providing maximum protection from UV rays', 7500, 'https://images.pexels.com/photos/7428100/pexels-photo-7428100.jpeg?auto=compress&cs=tinysrgb&w=800', 'Sunscreens', 40, 4.9, true)
ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICATION
-- ========================================

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete!';
  RAISE NOTICE 'Admin credentials:';
  RAISE NOTICE '  Email: admin@deeskinstore.com';
  RAISE NOTICE '  Password: admin123';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT: Change the admin password after first login!';
END $$;
