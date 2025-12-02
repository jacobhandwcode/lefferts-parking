'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RevenueHeatMap = ({ data, selectedLocation, onLocationSelect }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [hoveredCell, setHoveredCell] = useState(null);

  const timeframes = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  const getIntensityColor = (value, max) => {
    const intensity = value / max;
    if (intensity >= 0.8) return 'bg-primary text-white';
    if (intensity >= 0.6) return 'bg-primary/80 text-white';
    if (intensity >= 0.4) return 'bg-primary/60 text-white';
    if (intensity >= 0.2) return 'bg-primary/40 text-foreground';
    return 'bg-primary/20 text-foreground';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const maxRevenue = Math.max(...data?.flatMap(location => 
    location?.timeData?.map(item => item?.revenue)
  ));

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Heat Map</h3>
          <p className="text-sm text-muted-foreground">Performance intensity across locations and time periods</p>
        </div>
        <div className="flex items-center space-x-2">
          {timeframes?.map((timeframe) => (
            <button
              key={timeframe?.id}
              onClick={() => setSelectedTimeframe(timeframe?.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-micro ${
                selectedTimeframe === timeframe?.id
                  ? 'bg-primary text-white' :'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {timeframe?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {data?.map((location) => (
          <div key={location?.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-foreground">{location?.name}</h4>
              <span className="text-xs text-muted-foreground">
                Total: {formatCurrency(location?.totalRevenue)}
              </span>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {location?.timeData?.map((item, index) => (
                <div
                  key={index}
                  className={`relative h-12 rounded cursor-pointer transition-all ${
                    getIntensityColor(item?.revenue, maxRevenue)
                  } hover:scale-105`}
                  onMouseEnter={() => setHoveredCell({ location: location?.name, ...item })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={() => onLocationSelect(location?.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {formatCurrency(item?.revenue)?.replace('$', '$')?.slice(0, 4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Intensity Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-primary/20 rounded"></div>
            <div className="w-4 h-4 bg-primary/40 rounded"></div>
            <div className="w-4 h-4 bg-primary/60 rounded"></div>
            <div className="w-4 h-4 bg-primary/80 rounded"></div>
            <div className="w-4 h-4 bg-primary rounded"></div>
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Max: {formatCurrency(maxRevenue)}
        </div>
      </div>
      {/* Hover Tooltip */}
      {hoveredCell && (
        <div className="fixed z-1100 bg-foreground text-white px-3 py-2 rounded-lg shadow-soft text-sm pointer-events-none"
             style={{ 
               left: '50%', 
               top: '50%', 
               transform: 'translate(-50%, -50%)' 
             }}>
          <div className="font-medium">{hoveredCell?.location}</div>
          <div>{hoveredCell?.period}: {formatCurrency(hoveredCell?.revenue)}</div>
          <div className="text-xs opacity-80">{hoveredCell?.transactions} transactions</div>
        </div>
      )}
    </div>
  );
};

RevenueHeatMap.propTypes = {
  data: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    name: PropTypes?.string?.isRequired,
    totalRevenue: PropTypes?.number?.isRequired,
    timeData: PropTypes?.arrayOf(PropTypes?.shape({
      period: PropTypes?.string?.isRequired,
      revenue: PropTypes?.number?.isRequired,
      transactions: PropTypes?.number?.isRequired
    }))?.isRequired
  }))?.isRequired,
  selectedLocation: PropTypes?.string,
  onLocationSelect: PropTypes?.func?.isRequired
};

export default RevenueHeatMap;