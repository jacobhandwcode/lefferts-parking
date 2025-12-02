'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TransactionFilters = ({ onFiltersChange, totalResults }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    location: '',
    transactionType: '',
    paymentMethod: '',
    amountRange: {
      min: '',
      max: ''
    },
    status: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const locations = [
    'All Locations',
    'Pacs',
    '11 ST',
    '54 Flagler',
    '18 Lincoln',
    '72 Park'
  ];

  const transactionTypes = [
    'All Types',
    'Hourly Parking',
    'Monthly Permit',
    'Employee Permit',
    'VIP Permit',
    'Event Parking',
    'Violation Payment'
  ];

  const paymentMethods = [
    'All Methods',
    'Credit Card',
    'Debit Card',
    'Mobile Payment',
    'Cash',
    'Bank Transfer',
    'Permit Credit'
  ];

  const statusOptions = [
    'All Status',
    'Completed',
    'Pending',
    'Failed',
    'Refunded',
    'Disputed'
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = {
      ...filters?.dateRange,
      [field]: value
    };
    const newFilters = {
      ...filters,
      dateRange: newDateRange
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmountRangeChange = (field, value) => {
    const newAmountRange = {
      ...filters?.amountRange,
      [field]: value
    };
    const newFilters = {
      ...filters,
      amountRange: newAmountRange
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { startDate: '', endDate: '' },
      location: '',
      transactionType: '',
      paymentMethod: '',
      amountRange: { min: '', max: '' },
      status: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters?.dateRange?.startDate || filters?.dateRange?.endDate || 
           filters?.location || filters?.transactionType || 
           filters?.paymentMethod || filters?.amountRange?.min || 
           filters?.amountRange?.max || filters?.status;
  };

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Transaction Filters</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="FunnelIcon" size={16} />
            <span>{totalResults?.toLocaleString()} results</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-sm text-error hover:bg-error/5 rounded-lg transition-micro"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-lg transition-micro"
          >
            <span>{isExpanded ? 'Less Filters' : 'More Filters'}</span>
            <Icon 
              name="ChevronDownIcon" 
              size={16} 
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters?.dateRange?.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters?.dateRange?.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <select
            value={filters?.location}
            onChange={(e) => handleFilterChange('location', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            {locations?.map((location) => (
              <option key={location} value={location === 'All Locations' ? '' : location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Transaction Type</label>
          <select
            value={filters?.transactionType}
            onChange={(e) => handleFilterChange('transactionType', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            {transactionTypes?.map((type) => (
              <option key={type} value={type === 'All Types' ? '' : type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Payment Method</label>
          <select
            value={filters?.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            {paymentMethods?.map((method) => (
              <option key={method} value={method === 'All Methods' ? '' : method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters?.amountRange?.min}
                onChange={(e) => handleAmountRangeChange('min', e?.target?.value)}
                placeholder="Min $"
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <input
                type="number"
                value={filters?.amountRange?.max}
                onChange={(e) => handleAmountRangeChange('max', e?.target?.value)}
                placeholder="Max $"
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              value={filters?.status}
              onChange={(e) => handleFilterChange('status', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              {statusOptions?.map((status) => (
                <option key={status} value={status === 'All Status' ? '' : status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

TransactionFilters.propTypes = {
  onFiltersChange: PropTypes?.func?.isRequired,
  totalResults: PropTypes?.number?.isRequired
};

export default TransactionFilters;