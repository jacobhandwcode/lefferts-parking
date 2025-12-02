'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const RevenueBarChart = ({ data, chartType, onChartTypeChange }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const metrics = [
    { id: 'revenue', label: 'Revenue', color: '#0066CC' },
    { id: 'transactions', label: 'Transactions', color: '#00A86B' },
    { id: 'occupancy', label: 'Occupancy %', color: '#F59E0B' }
  ];

  const chartTypes = [
    { id: 'location', label: 'By Location', icon: 'MapPinIcon' },
    { id: 'timeperiod', label: 'By Time Period', icon: 'ClockIcon' },
    { id: 'comparison', label: 'Comparison', icon: 'ChartBarIcon' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'Revenue') return formatCurrency(value);
    if (name === 'Occupancy %') return `${value}%`;
    return value?.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-soft p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {formatTooltipValue(entry?.value, entry?.name)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg border border-border ${isFullscreen ? 'fixed inset-4 z-1100' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-6 p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Analysis</h3>
          <p className="text-sm text-muted-foreground">Comparative performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
            {chartTypes?.map((type) => (
              <button
                key={type?.id}
                onClick={() => onChartTypeChange(type?.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-micro ${
                  chartType === type?.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={16} />
                <span className="hidden sm:inline">{type?.label}</span>
              </button>
            ))}
          </div>

          {/* Metric Selector */}
          <div className="flex items-center space-x-1 bg-surface rounded-lg p-1">
            {metrics?.map((metric) => (
              <button
                key={metric?.id}
                onClick={() => setSelectedMetric(metric?.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-micro ${
                  selectedMetric === metric?.id
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {metric?.label}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name={isFullscreen ? "ArrowsPointingInIcon" : "ArrowsPointingOutIcon"} size={20} />
          </button>
        </div>
      </div>
      <div className={`${isFullscreen ? 'h-[calc(100vh-200px)] px-6 pb-6' : 'h-80'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                if (selectedMetric === 'revenue') return `$${(value / 1000)?.toFixed(0)}K`;
                if (selectedMetric === 'occupancy') return `${value}%`;
                return value?.toLocaleString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetric === 'revenue' && (
              <Bar 
                dataKey="revenue" 
                name="Revenue"
                fill="#0066CC" 
                radius={[4, 4, 0, 0]}
              />
            )}
            
            {selectedMetric === 'transactions' && (
              <Bar 
                dataKey="transactions" 
                name="Transactions"
                fill="#00A86B" 
                radius={[4, 4, 0, 0]}
              />
            )}
            
            {selectedMetric === 'occupancy' && (
              <Bar 
                dataKey="occupancy" 
                name="Occupancy %"
                fill="#F59E0B" 
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-border px-6">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Showing {data?.length} data points
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro">
            <Icon name="ShareIcon" size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/50 z-1050" onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  );
};

RevenueBarChart.propTypes = {
  data: PropTypes?.arrayOf(PropTypes?.shape({
    name: PropTypes?.string?.isRequired,
    revenue: PropTypes?.number?.isRequired,
    transactions: PropTypes?.number?.isRequired,
    occupancy: PropTypes?.number?.isRequired
  }))?.isRequired,
  chartType: PropTypes?.string?.isRequired,
  onChartTypeChange: PropTypes?.func?.isRequired
};

export default RevenueBarChart;