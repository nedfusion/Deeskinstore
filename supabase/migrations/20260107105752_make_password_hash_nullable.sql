/*
  # Make password_hash nullable in admins table

  ## Problem
  The password_hash column is required (NOT NULL) but we're using Supabase Auth for authentication.
  
  ## Solution
  Make password_hash nullable since authentication is handled by Supabase Auth.
  
  ## Changes
  - Alter admins.password_hash to allow NULL values
  - Set default value to empty string for backward compatibility
*/

ALTER TABLE admins 
ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE admins 
ALTER COLUMN password_hash SET DEFAULT '';
