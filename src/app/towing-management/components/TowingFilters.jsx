'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TowingFilters = ({ onFilterChange, onSearch }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    towCompany: 'all',
    dateRange: 'today'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'pacs', label: 'Pacs' },
    { value: '11-st', label: '11 ST' },
    { value: '54-flagler', label: '54 Flagler' },
    { value: '18-lincoln', label: '18 Lincoln' },
    { value: '72-park', label: '72 Park' }
  ];

  const towCompanyOptions = [
    { value: 'all', label: 'All Companies' },
    { value: 'metro-towing', label: 'Metro Towing' },
    { value: 'city-tow', label: 'City Tow Services' },
    { value: 'rapid-recovery', label: 'Rapid Recovery' },
    { value: 'downtown-towing', label: 'Downtown Towing' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = { ...customDateRange, [key]: value };
    setCustomDateRange(newDateRange);
    if (newDateRange?.startDate && newDateRange?.endDate) {
      onFilterChange({ ...filters, customDateRange: newDateRange });
    }
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      status: 'all',
      location: 'all',
      towCompany: 'all',
      dateRange: 'today'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    setCustomDateRange({ startDate: '', endDate: '' });
    onFilterChange(defaultFilters);
    onSearch('');
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Towing Records</h3>
        <button
          onClick={handleClearFilters}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
        >
          <Icon name="XMarkIcon" size={16} />
          <span>Clear Filters</span>
        </button>
      </div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by license plate or towing reference number..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters?.status}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <select
            value={filters?.location}
            onChange={(e) => handleFilterChange('location', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {locationOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tow Company Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Tow Company</label>
          <select
            value={filters?.towCompany}
            onChange={(e) => handleFilterChange('towCompany', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {towCompanyOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <select
            value={filters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {dateRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={customDateRange?.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
            <input
              type="date"
              value={customDateRange?.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

TowingFilters.propTypes = {
  onFilterChange: PropTypes?.func?.isRequired,
  onSearch: PropTypes?.func?.isRequired
};

export default TowingFilters;