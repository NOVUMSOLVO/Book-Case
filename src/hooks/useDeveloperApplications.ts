import { useState, useEffect } from 'react';
import { supabase, type DeveloperApplication, handleSupabaseError, getCurrentUserId } from '../lib/supabase';

export const useDeveloperApplications = (userId?: string) => {
  const [applications, setApplications] = useState<DeveloperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('developer_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (applicationData: {
    developer_name: string;
    developer_website?: string;
    developer_bio: string;
    portfolio_links?: string[];
    experience_years?: number;
    motivation: string;
  }) => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('developer_applications')
        .insert({
          user_id: currentUserId,
          ...applicationData
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchApplications();
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const hasApplication = () => {
    return applications.length > 0;
  };

  const getLatestApplication = () => {
    return applications[0];
  };

  return {
    applications,
    loading,
    error,
    submitApplication,
    hasApplication,
    getLatestApplication,
    refetch: fetchApplications
  };
};