
-- Create a profiles table for storing additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies to existing tables for businesses (assuming they should be tied to users)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own businesses" 
  ON public.businesses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own businesses" 
  ON public.businesses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses" 
  ON public.businesses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own businesses" 
  ON public.businesses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for services (tied to business owners)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their services" 
  ON public.services 
  FOR ALL 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

-- Add RLS policies for bookings (customers can see their own, business owners can see theirs)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE email = auth.email()
    )
  );

CREATE POLICY "Business owners can view their bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage their bookings" 
  ON public.bookings 
  FOR ALL 
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE user_id = auth.uid()
    )
  );

-- Customers table policies (public read for business discovery)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view customers" 
  ON public.customers 
  FOR SELECT 
  USING (true);
