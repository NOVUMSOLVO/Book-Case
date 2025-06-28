import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download } from 'lucide-react';
import type { App } from '../lib/supabase';

interface AppCardProps {
  app: App;
  className?: string;
}

const AppCard: React.FC<AppCardProps> = ({ app, className = '' }) => {
  const formatDownloadCount = (count: number) => {
    if (count >= 1000000) return `${Math.floor(count / 1000000)}M+`;
    if (count >= 1000) return `${Math.floor(count / 1000)}K+`;
    return count.toString();
  };

  const formatPrice = (price: number, isFree: boolean) => {
    if (isFree) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <Link
      to={`/apps/${app.slug}`}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1 group ${className}`}
      aria-label={`View ${app.name} app details`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img
            src={app.icon_url || 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
            alt={app.name}
            className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
              {app.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {app.short_description}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{app.rating_average?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{formatDownloadCount(app.download_count || 0)}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(app.price_usd || 0, app.is_free)}
                </div>
                <div className="text-xs text-gray-500">
                  {app.category?.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AppCard;