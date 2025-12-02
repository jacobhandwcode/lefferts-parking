'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TimeWindowConfig = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleWindowChange = (windowIndex, field, value) => {
    const updatedWindows = [...localConfig?.timeWindows];
    updatedWindows[windowIndex] = {
      ...updatedWindows?.[windowIndex],
      [field]: field === 'rate' ? parseFloat(value) || 0 : value
    };
    
    const updatedConfig = {
      ...localConfig,
      timeWindows: updatedWindows
    };
    setLocalConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const handleTaxToggle = () => {
    const updatedConfig = {
      ...localConfig,
      includeTax: !localConfig?.includeTax
    };
    setLocalConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const addTimeWindow = () => {
    const newWindow = {
      name: `Window ${localConfig?.timeWindows?.length + 1}`,
      startTime: '09:00',
      endTime: '17:00',
      rate: 0,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    };
    const updatedConfig = {
      ...localConfig,
      timeWindows: [...localConfig?.timeWindows, newWindow]
    };
    setLocalConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const removeTimeWindow = (windowIndex) => {
    if (localConfig?.timeWindows?.length > 1) {
      const updatedWindows = localConfig?.timeWindows?.filter((_, index) => index !== windowIndex);
      const updatedConfig = {
        ...localConfig,
        timeWindows: updatedWindows
      };
      setLocalConfig(updatedConfig);
      onConfigChange(updatedConfig);
    }
  };

  const toggleDay = (windowIndex, day) => {
    const window = localConfig?.timeWindows?.[windowIndex];
    const updatedDays = window?.days?.includes(day)
      ? window?.days?.filter(d => d !== day)
      : [...window?.days, day];
    
    handleWindowChange(windowIndex, 'days', updatedDays);
  };

  const calculateWithTax = (amount) => {
    return localConfig?.includeTax ? amount * 1.08 : amount;
  };

  const dayLabels = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Time Window Pricing</h3>
          <p className="text-sm text-muted-foreground">Configure rates for specific time periods</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig?.includeTax}
              onChange={handleTaxToggle}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-foreground">Include 8% tax</span>
          </label>
        </div>
      </div>
      {/* Time Windows */}
      <div className="space-y-6 mb-6">
        {localConfig?.timeWindows?.map((window, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={window?.name}
                  onChange={(e) => handleWindowChange(index, 'name', e?.target?.value)}
                  className="font-medium text-foreground bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
                  placeholder="Window name"
                />
              </div>
              {localConfig?.timeWindows?.length > 1 && (
                <button
                  onClick={() => removeTimeWindow(index)}
                  className="p-2 text-error hover:bg-error/10 rounded-lg transition-micro"
                >
                  <Icon name="TrashIcon" size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Start Time */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={window?.startTime}
                  onChange={(e) => handleWindowChange(index, 'startTime', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={window?.endTime}
                  onChange={(e) => handleWindowChange(index, 'endTime', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Hourly Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={window?.rate}
                    onChange={(e) => handleWindowChange(index, 'rate', e?.target?.value)}
                    className="w-full pl-8 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Final: ${calculateWithTax(window?.rate)?.toFixed(2)}/hr
                </p>
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Active Days
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dayLabels)?.map(([day, label]) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(index, day)}
                    className={`px-3 py-1 text-sm rounded-full transition-micro ${
                      window?.days?.includes(day)
                        ? 'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Time Window Button */}
      <button
        onClick={addTimeWindow}
        className="flex items-center space-x-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-micro mb-6"
      >
        <Icon name="PlusIcon" size={16} />
        <span className="text-sm font-medium">Add Time Window</span>
      </button>
      {/* Default Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Default Rate (Outside Windows)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              step="0.25"
              min="0"
              value={localConfig?.defaultRate}
              onChange={(e) => {
                const updatedConfig = {
                  ...localConfig,
                  defaultRate: parseFloat(e?.target?.value) || 0
                };
                setLocalConfig(updatedConfig);
                onConfigChange(updatedConfig);
              }}
              className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="3.00"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Final rate: ${calculateWithTax(localConfig?.defaultRate)?.toFixed(2)}/hour
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Maximum Daily Rate
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              step="0.25"
              min="0"
              value={localConfig?.maxDailyRate}
              onChange={(e) => {
                const updatedConfig = {
                  ...localConfig,
                  maxDailyRate: parseFloat(e?.target?.value) || 0
                };
                setLocalConfig(updatedConfig);
                onConfigChange(updatedConfig);
              }}
              className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="25.00"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Final rate: ${calculateWithTax(localConfig?.maxDailyRate)?.toFixed(2)}/day
          </p>
        </div>
      </div>
      {/* Schedule Preview */}
      <div className="p-4 bg-surface rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">Weekly Schedule Preview</h4>
        <div className="space-y-2">
          {localConfig?.timeWindows?.map((window, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-foreground">{window?.name}</span>
                <span className="text-muted-foreground">
                  {window?.startTime} - {window?.endTime}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-muted-foreground">
                  {window?.days?.map(day => dayLabels?.[day])?.join(', ')}
                </span>
                <span className="font-medium text-foreground">
                  ${calculateWithTax(window?.rate)?.toFixed(2)}/hr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TimeWindowConfig.propTypes = {
  config: PropTypes?.shape({
    timeWindows: PropTypes?.arrayOf(PropTypes?.shape({
      name: PropTypes?.string?.isRequired,
      startTime: PropTypes?.string?.isRequired,
      endTime: PropTypes?.string?.isRequired,
      rate: PropTypes?.number?.isRequired,
      days: PropTypes?.arrayOf(PropTypes?.string)?.isRequired
    }))?.isRequired,
    defaultRate: PropTypes?.number?.isRequired,
    maxDailyRate: PropTypes?.number?.isRequired,
    includeTax: PropTypes?.bool?.isRequired
  })?.isRequired,
  onConfigChange: PropTypes?.func?.isRequired
};

export default TimeWindowConfig;