-- Supabase Schema & Security Setup for MicroCoach
-- Execute this file in the Supabase SQL Editor

-- 1. Create Tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  daily_goal INT NOT NULL DEFAULT 100,
  reminder_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.pushup_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL CHECK (amount > 0 AND amount <= 5000),
  date_str VARCHAR(10) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pushup_entries ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
CREATE POLICY "Lees eigen profiel" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Wijzig eigen profiel" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 4. Pushup Entries Policies
CREATE POLICY "Lees eigen entries" ON public.pushup_entries 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Voeg eigen entries toe" ON public.pushup_entries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Verwijder eigen entries" ON public.pushup_entries 
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow re-running this script
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
