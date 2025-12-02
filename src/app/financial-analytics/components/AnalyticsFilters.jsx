'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const AnalyticsFilters = ({ filters, onFiltersChange, onExport, onScheduleReport }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({
    startDate: filters?.dateRange?.startDate,
    endDate: filters?.dateRange?.endDate
  });

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'pacs', name: 'Pacs' },
    { id: '11st', name: '11 ST' },
    { id: '54flagler', name: '54 Flagler' },
    { id: '18lincoln', name: '18 Lincoln' },
    { id: '72park', name: '72 Park' }
  ];

  const revenueCategories = [
    { id: 'all', name: 'All Revenue' },
    { id: 'hourly', name: 'Hourly Parking' },
    { id: 'monthly', name: 'Monthly Permits' },
    { id: 'employee', name: 'Employee Permits' },
    { id: 'vip', name: 'VIP Permits' },
    { id: 'violations', name: 'Violation Fees' }
  ];

  const timeframes = [
    { id: 'today', name: 'Today' },
    { id: 'wtd', name: 'Week to Date' },
    { id: 'mtd', name: 'Month to Date' },
    { id: 'ytd', name: 'Year to Date' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (field, value) => {
    setTempDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: tempDateRange,
      timeframe: 'custom'
    });
    setIsDatePickerOpen(false);
  };

  const handleTimeframeChange = (timeframe) => {
    const today = new Date();
    let startDate, endDate;

    switch (timeframe) {
      case 'today':
        startDate = endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'wtd':
        const startOfWeek = new Date(today);
        startOfWeek?.setDate(today?.getDate() - today?.getDay());
        startDate = startOfWeek?.toISOString()?.split('T')?.[0];
        endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'mtd':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)?.toISOString()?.split('T')?.[0];
        endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'ytd':
        startDate = new Date(today.getFullYear(), 0, 1)?.toISOString()?.split('T')?.[0];
        endDate = today?.toISOString()?.split('T')?.[0];
        break;
      case 'custom':
        setIsDatePickerOpen(true);
        return;
      default:
        return;
    }

    onFiltersChange({
      ...filters,
      timeframe,
      dateRange: { startDate, endDate }
    });
  };

  const formatDateRange = () => {
    const start = new Date(filters.dateRange.startDate)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const end = new Date(filters.dateRange.endDate)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Analysis Filters</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onScheduleReport}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="CalendarIcon" size={16} />
            <span>Schedule Report</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export Data</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Timeframe Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Time Period</label>
          <div className="grid grid-cols-2 gap-1 bg-surface rounded-lg p-1">
            {timeframes?.slice(0, 4)?.map((timeframe) => (
              <button
                key={timeframe?.id}
                onClick={() => handleTimeframeChange(timeframe?.id)}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-micro ${
                  filters?.timeframe === timeframe?.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {timeframe?.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleTimeframeChange('custom')}
            className={`w-full px-3 py-2 text-sm font-medium rounded-lg border transition-micro ${
              filters?.timeframe === 'custom' ?'border-primary bg-primary/5 text-primary' :'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {filters?.timeframe === 'custom' ? formatDateRange() : 'Custom Range'}
          </button>
        </div>

        {/* Location Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <select
            value={filters?.selectedLocation}
            onChange={(e) => handleFilterChange('selectedLocation', e?.target?.value)}
            className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {locations?.map((location) => (
              <option key={location?.id} value={location?.id}>
                {location?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Revenue Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Revenue Category</label>
          <select
            value={filters?.revenueCategory}
            onChange={(e) => handleFilterChange('revenueCategory', e?.target?.value)}
            className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {revenueCategories?.map((category) => (
              <option key={category?.id} value={category?.id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Timeframe */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Compare With</label>
          <select
            value={filters?.comparisonTimeframe}
            onChange={(e) => handleFilterChange('comparisonTimeframe', e?.target?.value)}
            className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="none">No Comparison</option>
            <option value="previous_period">Previous Period</option>
            <option value="previous_month">Previous Month</option>
            <option value="previous_year">Previous Year</option>
          </select>
        </div>
      </div>
      {/* Custom Date Range Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100">
          <div className="bg-white rounded-lg border border-border p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Select Date Range</h4>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-micro"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  value={tempDateRange?.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                <input
                  type="date"
                  value={tempDateRange?.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
              >
                Cancel
              </button>
              <button
                onClick={applyDateRange}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnalyticsFilters.propTypes = {
  filters: PropTypes?.shape({
    timeframe: PropTypes?.string?.isRequired,
    selectedLocation: PropTypes?.string?.isRequired,
    revenueCategory: PropTypes?.string?.isRequired,
    comparisonTimeframe: PropTypes?.string?.isRequired,
    dateRange: PropTypes?.shape({
      startDate: PropTypes?.string?.isRequired,
      endDate: PropTypes?.string?.isRequired
    })?.isRequired
  })?.isRequired,
  onFiltersChange: PropTypes?.func?.isRequired,
  onExport: PropTypes?.func?.isRequired,
  onScheduleReport: PropTypes?.func?.isRequired
};

export default AnalyticsFilters;