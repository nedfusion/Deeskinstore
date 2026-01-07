/*
  # Create Proper Admin User with Supabase Auth (Fixed)

  ## Problem
  Previously created auth.users record had incompatible password hash.

  ## Solution
  Create admin user using proper Supabase Auth password hashing with all required fields.
  
  ## Changes
  - Create auth.users record with properly hashed password
  - Create auth.identities record with provider_id
  - Link to admins table
  
  ## Credentials
  - Email: admin@deeskinstore.com
  - Password: admin123
*/

DO $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
BEGIN
  -- Generate new user ID
  v_user_id := extensions.uuid_generate_v4();
  
  -- Use Supabase's password hashing
  v_encrypted_password := extensions.crypt('admin123', extensions.gen_salt('bf'));

  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'admin@deeskinstore.com',
    v_encrypted_password,
    now(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Super Administrator"}'::jsonb,
    NULL,
    now(),
    now(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

  -- Create identity with provider_id
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
    format('{"sub":"%s","email":"%s"}', v_user_id::text, 'admin@deeskinstore.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  -- Update admin record with user_id
  UPDATE admins
  SET user_id = v_user_id
  WHERE email = 'admin@deeskinstore.com';

  RAISE NOTICE 'Created admin user with ID: %', v_user_id;
END $$;
