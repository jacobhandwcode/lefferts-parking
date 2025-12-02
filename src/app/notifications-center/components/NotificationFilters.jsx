'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const NotificationFilters = ({ 
  selectedType, 
  selectedLocation, 
  selectedUrgency, 
  selectedStatus,
  onTypeChange, 
  onLocationChange, 
  onUrgencyChange, 
  onStatusChange,
  onClearFilters 
}) => {
  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'car_validation', label: 'Car Validation' },
    { value: 'price_change', label: 'Price Changes' },
    { value: 'new_booking', label: 'New Bookings' },
    { value: 'ticket_dismissal', label: 'Ticket Dismissals' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Pacs', label: 'Pacs' },
    { value: '11 ST', label: '11 ST' },
    { value: '54 Flagler', label: '54 Flagler' },
    { value: '18 Lincoln', label: '18 Lincoln' },
    { value: '72 Park', label: '72 Park' }
  ];

  const urgencyLevels = [
    { value: 'all', label: 'All Urgency' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'closed', label: 'Closed' }
  ];

  const hasActiveFilters = selectedType !== 'all' || selectedLocation !== 'all' || 
                          selectedUrgency !== 'all' || selectedStatus !== 'all';

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filter Notifications</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-micro"
          >
            <Icon name="XMarkIcon" size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Notification Type Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Notification Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {notificationTypes?.map(type => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {locations?.map(location => (
              <option key={location?.value} value={location?.value}>
                {location?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Urgency Level
          </label>
          <select
            value={selectedUrgency}
            onChange={(e) => onUrgencyChange(e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {urgencyLevels?.map(urgency => (
              <option key={urgency?.value} value={urgency?.value}>
                {urgency?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e?.target?.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions?.map(status => (
              <option key={status?.value} value={status?.value}>
                {status?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

NotificationFilters.propTypes = {
  selectedType: PropTypes?.string?.isRequired,
  selectedLocation: PropTypes?.string?.isRequired,
  selectedUrgency: PropTypes?.string?.isRequired,
  selectedStatus: PropTypes?.string?.isRequired,
  onTypeChange: PropTypes?.func?.isRequired,
  onLocationChange: PropTypes?.func?.isRequired,
  onUrgencyChange: PropTypes?.func?.isRequired,
  onStatusChange: PropTypes?.func?.isRequired,
  onClearFilters: PropTypes?.func?.isRequired
};

export default NotificationFilters;