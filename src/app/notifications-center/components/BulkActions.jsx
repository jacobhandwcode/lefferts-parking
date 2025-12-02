'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const BulkActions = ({ 
  selectedNotifications, 
  onSelectAll, 
  onDeselectAll, 
  onBulkAccept, 
  onBulkClose,
  totalNotifications 
}) => {
  const hasSelected = selectedNotifications?.length > 0;
  const allSelected = selectedNotifications?.length === totalNotifications;

  return (
    <div className="bg-white border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? onDeselectAll : onSelectAll}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-medium text-foreground">
              {hasSelected ? `${selectedNotifications?.length} selected` : 'Select all'}
            </span>
          </div>
          
          {hasSelected && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onBulkAccept}
                className="flex items-center space-x-1 px-3 py-1.5 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90 transition-micro"
              >
                <Icon name="CheckIcon" size={16} />
                <span>Accept Selected</span>
              </button>
              <button
                onClick={onBulkClose}
                className="flex items-center space-x-1 px-3 py-1.5 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-micro"
              >
                <Icon name="XMarkIcon" size={16} />
                <span>Close Selected</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {totalNotifications} total notifications
        </div>
      </div>
    </div>
  );
};

BulkActions.propTypes = {
  selectedNotifications: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
  onSelectAll: PropTypes?.func?.isRequired,
  onDeselectAll: PropTypes?.func?.isRequired,
  onBulkAccept: PropTypes?.func?.isRequired,
  onBulkClose: PropTypes?.func?.isRequired,
  totalNotifications: PropTypes?.number?.isRequired
};

export default BulkActions;