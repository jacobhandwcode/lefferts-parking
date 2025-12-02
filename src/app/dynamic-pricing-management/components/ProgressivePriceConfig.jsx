'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const ProgressivePriceConfig = ({ config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleTierChange = (tierIndex, field, value) => {
    const updatedTiers = [...localConfig?.tiers];
    updatedTiers[tierIndex] = {
      ...updatedTiers?.[tierIndex],
      [field]: field === 'rate' ? parseFloat(value) || 0 : parseInt(value) || 0
    };
    
    const updatedConfig = {
      ...localConfig,
      tiers: updatedTiers
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

  const addTier = () => {
    const newTier = {
      hours: localConfig?.tiers?.length + 1,
      rate: 0
    };
    const updatedConfig = {
      ...localConfig,
      tiers: [...localConfig?.tiers, newTier]
    };
    setLocalConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const removeTier = (tierIndex) => {
    if (localConfig?.tiers?.length > 1) {
      const updatedTiers = localConfig?.tiers?.filter((_, index) => index !== tierIndex);
      const updatedConfig = {
        ...localConfig,
        tiers: updatedTiers
      };
      setLocalConfig(updatedConfig);
      onConfigChange(updatedConfig);
    }
  };

  const calculateWithTax = (amount) => {
    return localConfig?.includeTax ? amount * 1.08 : amount;
  };

  const calculateTotalCost = (hours) => {
    let total = 0;
    let remainingHours = hours;

    for (let i = 0; i < localConfig?.tiers?.length && remainingHours > 0; i++) {
      const tier = localConfig?.tiers?.[i];
      const hoursInTier = Math.min(remainingHours, tier?.hours);
      total += hoursInTier * tier?.rate;
      remainingHours -= hoursInTier;
    }

    return Math.min(total, localConfig?.maxDailyRate);
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Progressive Pricing Tiers</h3>
          <p className="text-sm text-muted-foreground">Rates increase with parking duration</p>
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
      {/* Pricing Tiers */}
      <div className="space-y-4 mb-6">
        {localConfig?.tiers?.map((tier, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  value={tier?.hours}
                  onChange={(e) => handleTierChange(index, 'hours', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Rate per hour
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={tier?.rate}
                    onChange={(e) => handleTierChange(index, 'rate', e?.target?.value)}
                    className="w-full pl-8 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <div className="text-sm">
                  <span className="text-muted-foreground">Final rate: </span>
                  <span className="font-medium text-foreground">
                    ${calculateWithTax(tier?.rate)?.toFixed(2)}/hr
                  </span>
                </div>
              </div>
            </div>

            {localConfig?.tiers?.length > 1 && (
              <button
                onClick={() => removeTier(index)}
                className="flex-shrink-0 p-2 text-error hover:bg-error/10 rounded-lg transition-micro"
              >
                <Icon name="TrashIcon" size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Add Tier Button */}
      <button
        onClick={addTier}
        className="flex items-center space-x-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-micro mb-6"
      >
        <Icon name="PlusIcon" size={16} />
        <span className="text-sm font-medium">Add Pricing Tier</span>
      </button>
      {/* Maximum Daily Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
      {/* Cost Preview */}
      <div className="p-4 bg-surface rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">Progressive Cost Preview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">2 Hours:</span>
            <span className="ml-2 font-medium text-foreground">
              ${calculateWithTax(calculateTotalCost(2))?.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">4 Hours:</span>
            <span className="ml-2 font-medium text-foreground">
              ${calculateWithTax(calculateTotalCost(4))?.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">8 Hours:</span>
            <span className="ml-2 font-medium text-foreground">
              ${calculateWithTax(calculateTotalCost(8))?.toFixed(2)}
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

ProgressivePriceConfig.propTypes = {
  config: PropTypes?.shape({
    tiers: PropTypes?.arrayOf(PropTypes?.shape({
      hours: PropTypes?.number?.isRequired,
      rate: PropTypes?.number?.isRequired
    }))?.isRequired,
    maxDailyRate: PropTypes?.number?.isRequired,
    includeTax: PropTypes?.bool?.isRequired
  })?.isRequired,
  onConfigChange: PropTypes?.func?.isRequired
};

export default ProgressivePriceConfig;