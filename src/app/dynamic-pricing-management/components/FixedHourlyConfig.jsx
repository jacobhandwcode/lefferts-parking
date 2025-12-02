'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';


const FixedHourlyConfig = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleRateChange = (field, value) => {
    const updatedConfig = {
      ...localConfig,
      [field]: parseFloat(value) || 0
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

  const calculateWithTax = (amount) => {
    return localConfig?.includeTax ? amount * 1.08 : amount;
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fixed Hourly Rates</h3>
          <p className="text-sm text-muted-foreground">Set consistent pricing throughout the day</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Standard Hourly Rate */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Standard Hourly Rate
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              step="0.25"
              min="0"
              value={localConfig?.standardRate}
              onChange={(e) => handleRateChange('standardRate', e?.target?.value)}
              className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="5.00"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Final rate: ${calculateWithTax(localConfig?.standardRate)?.toFixed(2)}/hour
          </p>
        </div>

        {/* Maximum Daily Rate */}
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
              onChange={(e) => handleRateChange('maxDailyRate', e?.target?.value)}
              className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="25.00"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Final rate: ${calculateWithTax(localConfig?.maxDailyRate)?.toFixed(2)}/day
          </p>
        </div>

        {/* Grace Period */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Grace Period (minutes)
          </label>
          <input
            type="number"
            min="0"
            max="60"
            value={localConfig?.gracePeriod}
            onChange={(e) => handleRateChange('gracePeriod', e?.target?.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="15"
          />
          <p className="text-xs text-muted-foreground">
            Free parking time before charges apply
          </p>
        </div>
      </div>
      {/* Rate Preview */}
      <div className="mt-6 p-4 bg-surface rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">Rate Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">1 Hour:</span>
            <span className="ml-2 font-medium text-foreground">
              ${calculateWithTax(localConfig?.standardRate)?.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">4 Hours:</span>
            <span className="ml-2 font-medium text-foreground">
              ${Math.min(calculateWithTax(localConfig?.standardRate * 4), calculateWithTax(localConfig?.maxDailyRate))?.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">8 Hours:</span>
            <span className="ml-2 font-medium text-foreground">
              ${Math.min(calculateWithTax(localConfig?.standardRate * 8), calculateWithTax(localConfig?.maxDailyRate))?.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Full Day:</span>
            <span className="ml-2 font-medium text-foreground">
              ${calculateWithTax(localConfig?.maxDailyRate)?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

FixedHourlyConfig.propTypes = {
  config: PropTypes?.shape({
    standardRate: PropTypes?.number?.isRequired,
    maxDailyRate: PropTypes?.number?.isRequired,
    gracePeriod: PropTypes?.number?.isRequired,
    includeTax: PropTypes?.bool?.isRequired
  })?.isRequired,
  onConfigChange: PropTypes?.func?.isRequired
};

export default FixedHourlyConfig;