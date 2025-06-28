import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './LoadingSpinner';

interface ReviewSectionProps {
  appId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ appId }) => {
  const { user } = useAuth();
  const { reviews, loading, submitReview, deleteReview, getUserReview } = useReviews(appId);
  const { success, error: showError } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const userReview = user ? getUserReview(user.id) : null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await submitReview(reviewForm.rating, reviewForm.title, reviewForm.comment);
      success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      showError('Failed to submit review', err instanceof Error ? err.message : undefined);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      await deleteReview(reviewId);
      success('Review deleted successfully!');
    } catch (err) {
      showError('Failed to delete review', err instanceof Error ? err.message : undefined);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews & Ratings</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h2>
        {user && !userReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(reviewForm.rating, true, (rating) => 
                setReviewForm(prev => ({ ...prev, rating }))
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                rows={4}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Share your thoughts about this app"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Your Review</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setReviewForm({
                    rating: userReview.rating,
                    title: userReview.title || '',
                    comment: userReview.comment || ''
                  });
                  setShowReviewForm(true);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteReview(userReview.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {renderStars(userReview.rating)}
          {userReview.title && (
            <h5 className="font-medium text-gray-900 mt-2">{userReview.title}</h5>
          )}
          {userReview.comment && (
            <p className="text-gray-700 mt-1">{userReview.comment}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {new Date(userReview.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      by {review.user?.full_name || 'Anonymous'}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-900">{review.title}</h4>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {review.comment && (
                <p className="text-gray-700 mb-2">{review.comment}</p>
              )}
              
              {review.is_verified_purchase && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified Purchase
                </span>
              )}
              
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this app!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;