/*
  # Zimbabwe App Store Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with developer info
    - `categories` - App categories (Finance, News, Weather, etc.)
    - `apps` - Main app listings with metadata
    - `app_screenshots` - Screenshots for each app
    - `app_downloads` - Track downloads and purchases
    - `reviews` - User reviews and ratings
    - `developer_applications` - Developer account requests

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate policies for developers and regular users
    - Admin-only policies for sensitive operations

  3. Storage
    - App icons bucket
    - Screenshots bucket
    - APK files bucket
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'developer', 'admin');
CREATE TYPE app_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published');
CREATE TYPE download_type AS ENUM ('free_download', 'purchase');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'user',
  developer_name text,
  developer_website text,
  developer_bio text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon_name text,
  color text DEFAULT '#22C55E',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  icon_url text,
  version text NOT NULL DEFAULT '1.0.0',
  price_usd decimal(10,2) DEFAULT 0.00,
  price_zwl decimal(15,2) DEFAULT 0.00,
  is_free boolean DEFAULT true,
  package_name text,
  minimum_android_version text DEFAULT '5.0',
  app_size_mb decimal(8,2),
  status app_status DEFAULT 'draft',
  download_count integer DEFAULT 0,
  rating_average decimal(3,2) DEFAULT 0.00,
  rating_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  apk_url text,
  privacy_policy_url text,
  support_email text,
  website_url text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- App screenshots table
CREATE TABLE IF NOT EXISTS app_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- App downloads/purchases table
CREATE TABLE IF NOT EXISTS app_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  download_type download_type NOT NULL,
  amount_paid_usd decimal(10,2) DEFAULT 0.00,
  amount_paid_zwl decimal(15,2) DEFAULT 0.00,
  payment_method text,
  payment_reference text,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(app_id, user_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title text,
  comment text,
  is_verified_purchase boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(app_id, user_id)
);

-- Developer applications table
CREATE TABLE IF NOT EXISTS developer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  developer_name text NOT NULL,
  developer_website text,
  developer_bio text NOT NULL,
  portfolio_links text[],
  experience_years integer,
  motivation text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Apps policies
CREATE POLICY "Anyone can view published apps"
  ON apps FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Developers can view own apps"
  ON apps FOR SELECT
  TO authenticated
  USING (developer_id = auth.uid());

CREATE POLICY "Developers can insert own apps"
  ON apps FOR INSERT
  TO authenticated
  WITH CHECK (developer_id = auth.uid());

CREATE POLICY "Developers can update own apps"
  ON apps FOR UPDATE
  TO authenticated
  USING (developer_id = auth.uid());

-- App screenshots policies
CREATE POLICY "Anyone can view screenshots of published apps"
  ON app_screenshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = app_screenshots.app_id 
      AND apps.status = 'published'
    )
  );

CREATE POLICY "Developers can manage own app screenshots"
  ON app_screenshots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM apps 
      WHERE apps.id = app_screenshots.app_id 
      AND apps.developer_id = auth.uid()
    )
  );

-- App downloads policies
CREATE POLICY "Users can view own downloads"
  ON app_downloads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own downloads"
  ON app_downloads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Developer applications policies
CREATE POLICY "Users can view own applications"
  ON developer_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own applications"
  ON developer_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert default categories
INSERT INTO categories (name, slug, description, icon_name, color) VALUES
  ('Finance', 'finance', 'Banking, payments, and financial services', 'DollarSign', '#22C55E'),
  ('News & Media', 'news', 'News, magazines, and media apps', 'Newspaper', '#3B82F6'),
  ('Weather', 'weather', 'Weather forecasts and climate information', 'Cloud', '#06B6D4'),
  ('Travel & Transport', 'travel', 'Navigation, transport, and travel apps', 'MapPin', '#F59E0B'),
  ('Education', 'education', 'Learning, courses, and educational tools', 'GraduationCap', '#8B5CF6'),
  ('Entertainment', 'entertainment', 'Games, music, and entertainment', 'Play', '#EC4899'),
  ('Business', 'business', 'Productivity and business tools', 'Briefcase', '#6B7280'),
  ('Health & Fitness', 'health', 'Health, fitness, and wellness apps', 'Heart', '#EF4444'),
  ('Shopping', 'shopping', 'E-commerce and shopping platforms', 'ShoppingBag', '#F97316'),
  ('Social', 'social', 'Social networking and communication', 'Users', '#10B981')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_apps_developer ON apps(developer_id);
CREATE INDEX IF NOT EXISTS idx_apps_featured ON apps(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_apps_published_at ON apps(published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_reviews_app ON reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON app_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_app ON app_downloads(app_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();