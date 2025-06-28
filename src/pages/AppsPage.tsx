import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AppFilters from '../components/AppFilters';
import AppGrid from '../components/AppGrid';
import Breadcrumb from '../components/Breadcrumb';
import { useApps, useCategories } from '../hooks/useApps';
import { useLanguage } from '../contexts/LanguageContext';

interface FilterState {
  category: string;
  priceRange: 'all' | 'free' | 'paid';
  rating: number;
  sortBy: 'newest' | 'popular' | 'rating' | 'name';
}

const AppsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    rating: 0,
    sortBy: 'newest'
  });

  const { categories } = useCategories();
  const { apps, loading, error } = useApps({
    category: filters.category !== 'all' ? filters.category : undefined,
    search: searchParams.get('search') || undefined
  });

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const filteredAndSortedApps = React.useMemo(() => {
    let filtered = [...apps];
    
    // Apply price filter
    if (filters.priceRange === 'free') {
      filtered = filtered.filter(app => app.is_free);
    } else if (filters.priceRange === 'paid') {
      filtered = filtered.filter(app => !app.is_free);
    }
    
    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(app => (app.rating_average || 0) >= filters.rating);
    }
    
    // Sort apps
    switch (filters.sortBy) {
      case 'popular':
        return filtered.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
      case 'rating':
        return filtered.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [apps, filters]);

  const searchQuery = searchParams.get('search') || '';
  const currentCategory = categories.find(cat => cat.slug === filters.category);

  const breadcrumbItems = [
    { label: t('nav.browse_apps'), href: '/apps' },
    ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ...(searchQuery ? [{ label: `${t('common.search')}: "${searchQuery}"` }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('apps.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('apps.description')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Search */}
            <SearchBar 
              onSearch={handleSearch}
              className="flex-1"
            />

            {/* Filters */}
            <AppFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category.slug}
                onClick={() => setFilters(prev => ({ ...prev, category: category.slug }))}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.category === category.slug
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <AppGrid
          apps={filteredAndSortedApps}
          loading={loading}
          error={error}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          emptyMessage={
            searchQuery 
              ? t('apps.no_apps_search', { query: searchQuery })
              : t('apps.no_apps_criteria')
          }
        />
      </div>
    </div>
  );
};

export default AppsPage;