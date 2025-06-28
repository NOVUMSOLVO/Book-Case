import { useState, useEffect } from 'react';
import { supabase, type App, type Category, handleSupabaseError } from '../lib/supabase';

interface UseAppsFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  status?: string;
  developerId?: string;
}

export const useApps = (filters?: UseAppsFilters) => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, [JSON.stringify(filters)]); // Stable dependency

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('apps')
        .select(`
          *,
          developer:profiles!developer_id(id, full_name, developer_name),
          category:categories!category_id(id, name, slug, color),
          screenshots:app_screenshots(id, image_url, caption, sort_order)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default to published apps for public viewing
        query = query.eq('status', 'published');
      }

      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category.slug', filters.category);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      if (filters?.developerId) {
        query = query.eq('developer_id', filters.developerId);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Sort screenshots by sort_order
      const appsWithSortedScreenshots = data?.map(app => ({
        ...app,
        screenshots: app.screenshots?.sort((a, b) => a.sort_order - b.sort_order) || []
      })) || [];

      setApps(appsWithSortedScreenshots);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return { apps, loading, error, refetch: fetchApps };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
};

export const useApp = (id: string) => {
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchApp();
    }
  }, [id]);

  const fetchApp = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('apps')
        .select(`
          *,
          developer:profiles!developer_id(id, full_name, developer_name, developer_website),
          category:categories!category_id(id, name, slug, color),
          screenshots:app_screenshots(id, image_url, caption, sort_order)
        `)
        .or(`id.eq.${id},slug.eq.${id}`) // Support both ID and slug lookup
        .single();

      if (error) throw error;

      // Sort screenshots by sort_order
      const appWithSortedScreenshots = {
        ...data,
        screenshots: data.screenshots?.sort((a, b) => a.sort_order - b.sort_order) || []
      };

      setApp(appWithSortedScreenshots);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return { app, loading, error, refetch: fetchApp };
};