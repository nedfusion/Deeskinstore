/*
  # Add Admin User Management Functions

  1. Issue
    - Admin users created through the UI are only stored in local React state
    - They are never saved to the database
    - Login fails because authenticate_admin queries the actual database
    - UserManagement component uses mock data instead of real database data

  2. New Functions
    - create_admin: Creates new admin user with hashed password
    - get_all_admins: Returns all admin users (without password hashes)
    - update_admin: Updates existing admin user details
    - update_admin_password: Updates admin password with new hash
    - delete_admin: Removes admin user from database

  3. Security
    - All functions use SECURITY DEFINER to bypass RLS
    - Password hashing uses existing hash_password function
    - Passwords never returned in queries
    - Email uniqueness enforced by database constraint
*/

-- Function to create a new admin user
CREATE OR REPLACE FUNCTION create_admin(
  p_email text,
  p_password text,
  p_full_name text,
  p_role text,
  p_is_active boolean DEFAULT true
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_admin_id uuid;
BEGIN
  -- Validate role
  IF p_role NOT IN ('super_admin', 'admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Must be super_admin, admin, or moderator';
  END IF;

  -- Insert new admin
  INSERT INTO admins (email, password_hash, full_name, role, is_active)
  VALUES (p_email, hash_password(p_password), p_full_name, p_role, p_is_active)
  RETURNING id INTO new_admin_id;

  RETURN new_admin_id;
END;
$$;

-- Function to get all admin users (without password hashes)
CREATE OR REPLACE FUNCTION get_all_admins()
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  created_at timestamptz,
  last_login timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    admins.id,
    admins.email,
    admins.full_name,
    admins.role,
    admins.is_active,
    admins.created_at,
    admins.last_login
  FROM admins
  ORDER BY admins.created_at DESC;
END;
$$;

-- Function to update admin user details (except password)
CREATE OR REPLACE FUNCTION update_admin(
  p_admin_id uuid,
  p_email text,
  p_full_name text,
  p_role text,
  p_is_active boolean
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate role
  IF p_role NOT IN ('super_admin', 'admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Must be super_admin, admin, or moderator';
  END IF;

  -- Update admin
  UPDATE admins
  SET 
    email = p_email,
    full_name = p_full_name,
    role = p_role,
    is_active = p_is_active
  WHERE id = p_admin_id;

  RETURN FOUND;
END;
$$;

-- Function to update admin password
CREATE OR REPLACE FUNCTION update_admin_password(
  p_admin_id uuid,
  p_new_password text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE admins
  SET password_hash = hash_password(p_new_password)
  WHERE id = p_admin_id;

  RETURN FOUND;
END;
$$;

-- Function to delete admin user
CREATE OR REPLACE FUNCTION delete_admin(
  p_admin_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admins
  WHERE id = p_admin_id;

  RETURN FOUND;
END;
$$;
