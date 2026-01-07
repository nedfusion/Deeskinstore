/*
  # Fix create_admin_with_auth Function

  ## Problem
  The create_admin_with_auth function references updated_at column which doesn't exist in admins table.

  ## Solution
  Recreate the function without the updated_at reference.
*/

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

  -- Update existing admin record with user_id
  UPDATE admins
  SET user_id = v_user_id,
      password_hash = hash_password(p_password)
  WHERE email = p_email
  RETURNING id INTO v_admin_id;

  -- If admin doesn't exist, create it
  IF v_admin_id IS NULL THEN
    INSERT INTO admins (email, user_id, password_hash, full_name, role, is_active)
    VALUES (p_email, v_user_id, hash_password(p_password), p_full_name, p_role, true)
    RETURNING id INTO v_admin_id;
  END IF;

  RETURN v_user_id;
END;
$$;