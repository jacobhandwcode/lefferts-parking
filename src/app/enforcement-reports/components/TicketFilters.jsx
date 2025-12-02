'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TicketFilters = ({ onFiltersChange, totalTickets }) => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-11-01',
    endDate: '2024-11-18'
  });
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusTabs = [
    { id: 'all', label: 'All Tickets', count: totalTickets },
    { id: 'issued', label: 'Issued', count: 156 },
    { id: 'paid', label: 'Paid', count: 89 },
    { id: 'dismissed', label: 'Dismissed', count: 23 },
    { id: 'refunded', label: 'Refunded', count: 12 }
  ];

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onFiltersChange({
      dateRange: newDateRange,
      status: activeStatus,
      search: searchQuery
    });
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    onFiltersChange({
      dateRange,
      status,
      search: searchQuery
    });
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onFiltersChange({
      dateRange,
      status: activeStatus,
      search: value
    });
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: '2024-11-01',
      endDate: '2024-11-18'
    };
    setDateRange(resetFilters);
    setActiveStatus('all');
    setSearchQuery('');
    onFiltersChange({
      dateRange: resetFilters,
      status: 'all',
      search: ''
    });
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6">
      {/* Date Range Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-0">
          <div className="flex items-center space-x-2">
            <Icon name="CalendarIcon" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Date Range:</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange?.startDate}
              onChange={(e) => handleDateChange('startDate', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              value={dateRange?.endDate}
              onChange={(e) => handleDateChange('endDate', e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Icon 
              name="MagnifyingGlassIcon" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search by Ticket ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-micro"
          >
            <Icon name="XMarkIcon" size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      {/* Status Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {statusTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => handleStatusChange(tab?.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-micro ${
                activeStatus === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <span>{tab?.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeStatus === tab?.id
                  ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
              }`}>
                {tab?.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

TicketFilters.propTypes = {
  onFiltersChange: PropTypes?.func?.isRequired,
  totalTickets: PropTypes?.number?.isRequired
};

export default TicketFilters;