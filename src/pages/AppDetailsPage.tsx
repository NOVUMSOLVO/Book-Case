import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, Download, Share2, Heart, ExternalLink, CheckCircle } from 'lucide-react';
import { useApp } from '../hooks/useApps';
import { useDownloads } from '../hooks/useDownloads';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import ReviewSection from '../components/ReviewSection';

const AppDetailsPage: React.FC = () => {
  const { slug } = useParams();
  const { app, loading, error } = useApp(slug || '');
  const { downloadApp, hasDownloaded } = useDownloads(user?.id);
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [selectedScreenshot, setSelectedScreenshot] = React.useState(0);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!app || !user) {
      showError('Please sign in to download apps');
      return;
    }
    
    if (hasDownloaded(app.id)) {
      // Already downloaded, just open the APK
      if (app.apk_url) {
        window.open(app.apk_url, '_blank');
      }
      return;
    }
    
    try {
      setDownloading(true);
      
      const downloadType = app.is_free ? 'free_download' : 'purchase';
      const paymentData = app.is_free ? {} : {
        amount_paid_usd: app.price_usd,
        amount_paid_zwl: app.price_zwl,
        payment_method: 'demo', // In production, this would come from payment processor
        payment_reference: `demo-${Date.now()}`
      };
      
      await downloadApp(app.id, downloadType, paymentData);
      
      success(
        app.is_free ? 'App downloaded successfully!' : 'App purchased and downloaded!',
        'You can now access this app anytime from your library.'
      );
      
      // Open APK if available
      if (app.apk_url) {
        window.open(app.apk_url, '_blank');
      }
    } catch (err) {
      showError('Download failed', err instanceof Error ? err.message : undefined);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && app) {
      try {
        await navigator.share({
          title: app.name,
          text: app.short_description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">App Not Found</h1>
            <p className="text-gray-600 mb-8">The app you're looking for doesn't exist or has been removed.</p>
            <a href="/apps" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Browse Apps
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* App Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={app.icon_url || 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'}
              alt={app.name}
              className="w-24 h-24 rounded-xl object-cover bg-gray-100 mx-auto sm:mx-0"
              loading="lazy"
            />
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{app.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{app.developer?.developer_name || app.developer?.full_name}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{app.rating_average?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-500">({app.rating_count || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Download className="w-5 h-5" />
                  <span>{(app.download_count || 0) >= 1000 ? `${Math.floor((app.download_count || 0) / 1000)}K+` : (app.download_count || 0)} downloads</span>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {app.category?.name}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-2xl font-bold text-green-600">
                  {app.is_free ? 'Free' : `$${(app.price_usd || 0).toFixed(2)}`}
                </div>
                <div className="flex space-x-2">
                  {hasDownloaded(app.id) ? (
                    <button 
                      onClick={handleDownload}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Open</span>
                    </button>
                  ) : (
                    <button 
                    onClick={handleDownload}
                      disabled={!user || downloading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <Download className="w-5 h-5" />
                      <span>
                        {downloading ? 'Processing...' : (app.is_free ? 'Install' : 'Purchase')}
                      </span>
                    </button>
                  )}
                  <button className="border border-gray-300 text-gray-700 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="border border-gray-300 text-gray-700 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {!user && (
                <p className="text-sm text-gray-500 mt-2">
                  <a href="/login" className="text-green-600 hover:text-green-700">Sign in</a> to download apps
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Screenshots */}
        {app.screenshots && app.screenshots.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Screenshots</h2>
            
            {/* Main Screenshot */}
            <div className="mb-4">
              <img
                src={app.screenshots[selectedScreenshot]?.image_url}
                alt={app.screenshots[selectedScreenshot]?.caption || `Screenshot ${selectedScreenshot + 1}`}
                className="w-full max-w-md mx-auto h-96 object-cover rounded-lg shadow-sm border border-gray-200"
                loading="lazy"
              />
            </div>
            
            {/* Screenshot Thumbnails */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {app.screenshots.map((screenshot) => (
                <img
                  key={screenshot.id}
                  src={screenshot.image_url}
                  alt={screenshot.caption || `Screenshot`}
                  className={`w-20 h-36 object-cover rounded-lg shadow-sm border-2 flex-shrink-0 cursor-pointer transition-all ${
                    selectedScreenshot === index ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedScreenshot(index)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this app</h2>
              <p className="text-gray-700 leading-relaxed">{app.full_description}</p>
            </div>

            {/* Reviews Section */}
            <ReviewSection appId={app.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* App Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">App Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">v{app.version}</span>
                </div>
                {app.app_size_mb && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">{formatFileSize(app.app_size_mb)}</span>
                  </div>
                )}
                {app.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="font-medium">{new Date(app.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads</span>
                  <span className="font-medium">{(app.download_count || 0) >= 1000 ? `${Math.floor((app.download_count || 0) / 1000)}K+` : (app.download_count || 0)}</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {app.minimum_android_version && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  <li className="text-gray-700 text-sm">
                    • Android {app.minimum_android_version} or higher
                  </li>
                  {app.app_size_mb && (
                    <li className="text-gray-700 text-sm">
                      • {Math.ceil(app.app_size_mb * 2)} MB available storage
                    </li>
                  )}
                  <li className="text-gray-700 text-sm">
                    • Internet connection required
                  </li>
                </ul>
              </div>
            )}

            {/* Developer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Developer</h3>
              <p className="text-gray-700 mb-3">{app.developer?.developer_name || app.developer?.full_name}</p>
              {app.developer?.developer_website && (
                <a 
                  href={app.developer.developer_website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1 mb-3"
                >
                  <span>Visit website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                View more apps →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsPage;