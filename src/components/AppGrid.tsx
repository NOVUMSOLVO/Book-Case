import React from 'react';
import { Grid, List } from 'lucide-react';
import AppCard from './AppCard';
import LoadingSpinner from './LoadingSpinner';
import type { App } from '../lib/supabase';

interface AppGridProps {
  apps: App[];
  loading?: boolean;
  error?: string | null;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  emptyMessage?: string;
  className?: string;
}

const AppGrid: React.FC<AppGridProps> = ({
  apps,
  loading = false,
  error = null,
  viewMode = 'grid',
  onViewModeChange,
  emptyMessage = "No apps found.",
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Apps</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {apps.length} app{apps.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Apps Grid */}
      {apps.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {apps.map(app => (
            <AppCard 
              key={app.id} 
              app={app} 
              className={viewMode === 'list' ? 'max-w-none' : ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Apps Found</h3>
            <p className="text-gray-600 mb-4">{emptyMessage}</p>
            <a 
              href="/apps" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse All Apps
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppGrid;