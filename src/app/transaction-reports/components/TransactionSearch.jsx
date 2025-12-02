'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TransactionSearch = ({ onSearch, onExport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  const searchTypes = [
    { value: 'all', label: 'All Fields' },
    { value: 'license_plate', label: 'License Plate' },
    { value: 'transaction_id', label: 'Transaction ID' },
    { value: 'payment_reference', label: 'Payment Reference' },
    { value: 'customer_name', label: 'Customer Name' }
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({ query: searchQuery, type: searchType });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch({ query: '', type: searchType });
  };

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="flex-1 relative">
              <Icon 
                name="MagnifyingGlassIcon" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                placeholder="Search transactions by license plate, ID, or payment reference..."
                className="w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-micro"
                >
                  <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
                </button>
              )}
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e?.target?.value)}
              className="px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {searchTypes?.map((type) => (
                <option key={type?.value} value={type?.value}>
                  {type?.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro font-medium"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-micro font-medium"
          >
            <Icon name="ArrowDownTrayIcon" size={20} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      {/* Quick Search Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Quick search:</span>
        {['ABC123', 'TXN-2024-001234', 'REF-789012', 'Failed transactions']?.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setSearchQuery(suggestion);
              onSearch({ query: suggestion, type: searchType });
            }}
            className="px-2 py-1 text-xs bg-surface text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-micro"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

TransactionSearch.propTypes = {
  onSearch: PropTypes?.func?.isRequired,
  onExport: PropTypes?.func?.isRequired
};

export default TransactionSearch;