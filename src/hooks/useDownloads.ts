import { useState, useEffect } from 'react';
import { supabase, type AppDownload, handleSupabaseError, getCurrentUserId } from '../lib/supabase';

export const useDownloads = (userId?: string) => {
  const [downloads, setDownloads] = useState<AppDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchDownloads();
    }
  }, [userId]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('app_downloads')
        .select(`
          *,
          app:apps(id, name, slug, icon_url, version)
        `)
        .eq('user_id', userId)
        .order('downloaded_at', { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const downloadApp = async (appId: string, downloadType: 'free_download' | 'purchase', paymentData?: {
    amount_paid_usd?: number;
    amount_paid_zwl?: number;
    payment_method?: string;
    payment_reference?: string;
  }) => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('app_downloads')
        .insert({
          app_id: appId,
          user_id: currentUserId,
          download_type: downloadType,
          ...paymentData
        })
        .select()
        .single();

      if (error) throw error;

      // Update download count
      await supabase.rpc('increment_download_count', { app_id: appId });

      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const hasDownloaded = (appId: string) => {
    return downloads.some(download => download.app_id === appId);
  };

  return {
    downloads,
    loading,
    error,
    downloadApp,
    hasDownloaded,
    refetch: fetchDownloads
  };
};