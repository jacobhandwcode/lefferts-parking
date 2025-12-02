'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const GlobalSearch = ({ placeholder = "Search license plates, permits, violations...", onSearch, className = "" }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search results for demonstration
  const mockResults = [
    {
      id: 1,
      type: 'license_plate',
      value: 'ABC123',
      description: 'Monthly Permit - Pacs',
      status: 'active',
      icon: 'DocumentTextIcon'
    },
    {
      id: 2,
      type: 'violation',
      value: 'VIO-2024-001234',
      description: 'Expired meter violation',
      status: 'pending',
      icon: 'ExclamationTriangleIcon'
    },
    {
      id: 3,
      type: 'permit',
      value: 'EMP-456789',
      description: 'Employee Permit - John Doe',
      status: 'active',
      icon: 'IdentificationIcon'
    },
    {
      id: 4,
      type: 'transaction',
      value: 'TXN-789012',
      description: '$15.00 - Hourly Parking',
      status: 'completed',
      icon: 'BanknotesIcon'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query?.trim()?.length > 0) {
        performSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults?.filter(result =>
        result?.value?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        result?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsOpen(true);
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
  };

  const handleResultClick = (result) => {
    setQuery(result?.value);
    setIsOpen(false);
    if (onSearch) {
      onSearch(result);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch({ type: 'search', value: query });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'expired':
        return 'text-error';
      case 'completed':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'license_plate':
        return 'License Plate';
      case 'violation':
        return 'Violation';
      case 'permit':
        return 'Permit';
      case 'transaction':
        return 'Transaction';
      default:
        return 'Result';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-micro"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef?.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-micro"
            >
              <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </form>
      {/* Search Results Dropdown */}
      {isOpen && results?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-soft z-1100 max-h-80 overflow-y-auto">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
              Search Results ({results?.length})
            </div>
            {results?.map((result) => (
              <button
                key={result?.id}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-muted transition-micro text-left"
              >
                <div className="flex-shrink-0">
                  <Icon name={result?.icon} size={20} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {result?.value}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-muted ${getStatusColor(result?.status)}`}>
                      {result?.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {getTypeLabel(result?.type)} • {result?.description}
                  </div>
                </div>
                <Icon name="ArrowRightIcon" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* No Results */}
      {isOpen && results?.length === 0 && query?.trim() && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-soft z-1100">
          <div className="px-3 py-8 text-center">
            <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground mx-auto mb-2" />
            <div className="text-sm font-medium text-foreground mb-1">No results found</div>
            <div className="text-xs text-muted-foreground">
              Try searching for license plates, permit numbers, or violation IDs
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;