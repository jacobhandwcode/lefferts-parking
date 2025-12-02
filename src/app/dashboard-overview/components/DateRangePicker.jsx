'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const formatDateForInput = (date) => {
    return date?.toISOString()?.split('T')?.[0];
  };

  const formatDisplayDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Date Range:</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="date"
            value={formatDateForInput(startDate)}
            onChange={(e) => onStartDateChange(new Date(e.target.value))}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
        
        <span className="text-muted-foreground text-sm">to</span>
        
        <div className="relative">
          <input
            type="date"
            value={formatDateForInput(endDate)}
            onChange={(e) => onEndDateChange(new Date(e.target.value))}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
      </div>
    </div>
  );
};

DateRangePicker.propTypes = {
  startDate: PropTypes?.instanceOf(Date)?.isRequired,
  endDate: PropTypes?.instanceOf(Date)?.isRequired,
  onStartDateChange: PropTypes?.func?.isRequired,
  onEndDateChange: PropTypes?.func?.isRequired
};

export default DateRangePicker;