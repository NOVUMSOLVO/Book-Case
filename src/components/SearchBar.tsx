import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search apps...", 
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const trendingSearches = [
    'EcoCash', 'Weather', 'News', 'Banking', 'Transport'
  ];

  useEffect(() => {
    const recent = storage.get(STORAGE_KEYS.recentSearches, []);
    setRecentSearches(recent);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    
    // Update recent searches
    const updatedRecent = [
      trimmedQuery,
      ...recentSearches.filter(item => item !== trimmedQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecent);
    storage.set(STORAGE_KEYS.recentSearches, updatedRecent);

    // Perform search
    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      navigate(`/apps?search=${encodeURIComponent(trimmedQuery)}`);
    }

    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    storage.remove(STORAGE_KEYS.recentSearches);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(item => item !== searchToRemove);
    setRecentSearches(updated);
    storage.set(STORAGE_KEYS.recentSearches, updated);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          autoComplete="off"
        />
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                    >
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </h3>
            <div className="space-y-1">
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-1 px-2 rounded"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;