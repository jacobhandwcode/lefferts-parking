'use client';

import React from 'react';
import PropTypes from 'prop-types';

const TimeFrameSelector = ({ selectedTimeFrame, onTimeFrameChange }) => {
  const timeFrames = [
    { id: 'today', label: 'Today' },
    { id: 'wtd', label: 'WTD' },
    { id: 'mtd', label: 'MTD' },
    { id: 'ytd', label: 'YTD' }
  ];

  return (
    <div className="flex items-center space-x-2 bg-surface rounded-lg p-1 border border-border">
      {timeFrames?.map((timeFrame) => (
        <button
          key={timeFrame?.id}
          onClick={() => onTimeFrameChange(timeFrame?.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-micro ${
            selectedTimeFrame === timeFrame?.id
              ? 'bg-primary text-white shadow-soft'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {timeFrame?.label}
        </button>
      ))}
    </div>
  );
};

TimeFrameSelector.propTypes = {
  selectedTimeFrame: PropTypes?.string?.isRequired,
  onTimeFrameChange: PropTypes?.func?.isRequired
};

export default TimeFrameSelector;