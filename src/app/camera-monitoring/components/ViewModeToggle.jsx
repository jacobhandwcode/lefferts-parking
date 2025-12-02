'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  const modes = [
    {
      id: 'grid',
      label: 'Grid View',
      icon: 'Squares2X2Icon',
      description: 'View all cameras'
    },
    {
      id: 'single',
      label: 'Single View',
      icon: 'RectangleStackIcon',
      description: 'Focus on one camera'
    }
  ];

  return (
    <div className="flex items-center bg-surface border border-border rounded-lg p-1">
      {modes?.map((mode) => (
        <button
          key={mode?.id}
          onClick={() => onViewModeChange(mode?.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro ${
            viewMode === mode?.id
              ? 'bg-white text-primary shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
          }`}
        >
          <Icon 
            name={mode?.icon} 
            size={16} 
            className={viewMode === mode?.id ? 'text-primary' : 'text-muted-foreground'} 
          />
          <span className="hidden sm:inline">{mode?.label}</span>
        </button>
      ))}
    </div>
  );
};

ViewModeToggle.propTypes = {
  viewMode: PropTypes?.oneOf(['grid', 'single'])?.isRequired,
  onViewModeChange: PropTypes?.func?.isRequired
};

export default ViewModeToggle;