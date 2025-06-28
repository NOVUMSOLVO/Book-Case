import { useState, useEffect } from 'react';
import { supabase, type Review, handleSupabaseError, getCurrentUserId } from '../lib/supabase';

export const useReviews = (appId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appId) {
      fetchReviews();
    }
  }, [appId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!user_id(id, full_name)
        `)
        .eq('app_id', appId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (rating: number, title?: string, comment?: string) => {
    try {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId || !appId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('reviews')
        .upsert({
          app_id: appId,
          user_id: currentUserId,
          rating,
          title,
          comment
        })
        .select()
        .single();

      if (error) throw error;

      // Update app rating
      await updateAppRating();
      
      return data;
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const updateAppRating = async () => {
    if (!appId) return;

    try {
      const { data: reviewStats } = await supabase
        .from('reviews')
        .select('rating')
        .eq('app_id', appId);

      if (reviewStats && reviewStats.length > 0) {
        const totalRating = reviewStats.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewStats.length;

        await supabase
          .from('apps')
          .update({
            rating_average: averageRating,
            rating_count: reviewStats.length
          })
          .eq('id', appId);
      }
    } catch (err) {
      console.error('Error updating app rating:', err);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      await updateAppRating();
      await fetchReviews();
    } catch (err) {
      throw new Error(handleSupabaseError(err));
    }
  };

  const getUserReview = (userId: string) => {
    return reviews.find(review => review.user_id === userId);
  };

  return {
    reviews,
    loading,
    error,
    submitReview,
    deleteReview,
    getUserReview,
    refetch: fetchReviews
  };
};