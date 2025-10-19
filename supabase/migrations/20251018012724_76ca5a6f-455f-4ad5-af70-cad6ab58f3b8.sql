-- Add bput_reg_no column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bput_reg_no TEXT;

-- Update the handle_new_user function to include bput_reg_no
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with name and BPUT registration number
  INSERT INTO public.profiles (user_id, email, name, bput_reg_no)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'bput_reg_no', '')
  );
  
  -- Assign student role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;