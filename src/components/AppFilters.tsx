import React from 'react';
import { Filter, X } from 'lucide-react';
import { useCategories } from '../hooks/useApps';

interface FilterState {
  category: string;
  priceRange: 'all' | 'free' | 'paid';
  rating: number;
  sortBy: 'newest' | 'popular' | 'rating' | 'name';
}

interface AppFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const AppFilters: React.FC<AppFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  className = "" 
}) => {
  const { categories } = useCategories();
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      priceRange: 'all',
      rating: 0,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.priceRange !== 'all' || 
                          filters.rating > 0;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
          hasActiveFilters 
            ? 'border-green-500 bg-green-50 text-green-700' 
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            {[
              filters.category !== 'all' ? 1 : 0,
              filters.priceRange !== 'all' ? 1 : 0,
              filters.rating > 0 ? 1 : 0
            ].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Apps' },
                  { value: 'free', label: 'Free Only' },
                  { value: 'paid', label: 'Paid Only' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={filters.priceRange === option.value}
                      onChange={(e) => updateFilter('priceRange', e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppFilters;