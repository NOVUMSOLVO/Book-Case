import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user ID
export const getCurrentUserId = () => {
  return supabase.auth.getUser().then(({ data: { user } }) => user?.id);
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'developer' | 'admin';
  developer_name?: string;
  developer_website?: string;
  developer_bio?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface App {
  id: string;
  developer_id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_url?: string;
  version: string;
  price_usd: number;
  price_zwl: number;
  is_free: boolean;
  package_name?: string;
  minimum_android_version: string;
  app_size_mb?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published';
  download_count: number;
  rating_average: number;
  rating_count: number;
  featured: boolean;
  apk_url?: string;
  privacy_policy_url?: string;
  support_email?: string;
  website_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  developer?: Profile;
  category?: Category;
  screenshots?: AppScreenshot[];
}

export interface AppScreenshot {
  id: string;
  app_id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
  created_at: string;
}

export interface AppDownload {
  id: string;
  app_id: string;
  user_id: string;
  download_type: 'free_download' | 'purchase';
  amount_paid_usd: number;
  amount_paid_zwl: number;
  payment_method?: string;
  payment_reference?: string;
  downloaded_at: string;
}

export interface Review {
  id: string;
  app_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  user?: Profile;
}

export interface DeveloperApplication {
  id: string;
  user_id: string;
  developer_name: string;
  developer_website?: string;
  developer_bio: string;
  portfolio_links?: string[];
  experience_years?: number;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
}