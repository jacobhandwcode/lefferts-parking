'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const LicensePlateSearch = ({ onSearch, searchResults }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (query?.trim()) {
      setIsSearching(true);
      await onSearch(query?.trim());
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    let value = e?.target?.value?.toUpperCase();
    // Format as XXX XXX pattern
    value = value?.replace(/[^A-Z0-9]/g, '');
    if (value?.length > 3) {
      value = value?.slice(0, 3) + ' ' + value?.slice(3, 6);
    }
    setQuery(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">License Plate Search</h2>
        <Icon name="MagnifyingGlassIcon" size={20} className="text-muted-foreground" />
      </div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter license plate (e.g., ABC 123)"
              maxLength={7}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-lg tracking-wider"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-micro"
              >
                <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!query?.trim() || isSearching}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro flex items-center space-x-2"
          >
            {isSearching ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Icon name="MagnifyingGlassIcon" size={16} />
            )}
            <span>Search</span>
          </button>
        </div>
      </form>
      {searchResults?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Recent Entries</h3>
            <span className="text-xs text-muted-foreground">{searchResults?.length} results</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {searchResults?.slice(0, 14)?.map((result) => (
              <div
                key={result?.id}
                className="bg-surface border border-border rounded-lg p-3 hover:bg-muted transition-micro"
              >
                <div className="font-mono text-sm font-bold text-foreground mb-1">
                  {result?.plate}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {result?.timestamp}
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  result?.status === 'authorized' ?'bg-success/10 text-success'
                    : result?.status === 'unauthorized' ?'bg-error/10 text-error' :'bg-warning/10 text-warning'
                }`}>
                  {result?.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {searchResults?.length === 0 && query && (
        <div className="text-center py-8">
          <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground mx-auto mb-2" />
          <div className="text-sm font-medium text-foreground mb-1">No results found</div>
          <div className="text-xs text-muted-foreground">
            Try searching for a different license plate
          </div>
        </div>
      )}
    </div>
  );
};

LicensePlateSearch.propTypes = {
  onSearch: PropTypes?.func?.isRequired,
  searchResults: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.oneOfType([PropTypes?.string, PropTypes?.number])?.isRequired,
      plate: PropTypes?.string?.isRequired,
      timestamp: PropTypes?.string?.isRequired,
      status: PropTypes?.oneOf(['authorized', 'unauthorized', 'pending'])?.isRequired
    })
  )?.isRequired
};

export default LicensePlateSearch;