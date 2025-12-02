import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const PricingModeSelector = ({ selectedMode, onModeChange }) => {
  const pricingModes = [
    {
      id: 'fixed',
      name: 'Fixed Hourly',
      description: 'Set consistent hourly rates throughout the day',
      icon: 'ClockIcon',
      features: ['Simple hourly pricing', 'Consistent rates', 'Easy to manage'],
      status: 'active'
    },
    {
      id: 'progressive',
      name: 'Progressive Price',
      description: 'Rates increase based on parking duration',
      icon: 'ChartBarIcon',
      features: ['Duration-based pricing', 'Discourages long stays', 'Revenue optimization'],
      status: 'available'
    },
    {
      id: 'timewindow',
      name: 'Time Window',
      description: 'Different rates for specific time periods',
      icon: 'CalendarIcon',
      features: ['Peak/off-peak pricing', 'Event-based rates', 'Maximum flexibility'],
      status: 'available'
    }
  ];

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Pricing Strategy</h3>
        <p className="text-sm text-muted-foreground">
          Choose the pricing model that best fits your operational needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingModes?.map((mode) => (
          <button
            key={mode?.id}
            onClick={() => onModeChange(mode?.id)}
            className={`p-4 border-2 rounded-lg text-left transition-micro ${
              selectedMode === mode?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                selectedMode === mode?.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={mode?.icon} size={20} />
              </div>
              {selectedMode === mode?.id && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
                  <Icon name="CheckIcon" size={12} />
                  <span>Active</span>
                </div>
              )}
            </div>

            <h4 className={`font-semibold mb-2 ${
              selectedMode === mode?.id ? 'text-primary' : 'text-foreground'
            }`}>
              {mode?.name}
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              {mode?.description}
            </p>

            <ul className="space-y-1">
              {mode?.features?.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="CheckIcon" size={12} className="text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
};

PricingModeSelector.propTypes = {
  selectedMode: PropTypes?.oneOf(['fixed', 'progressive', 'timewindow'])?.isRequired,
  onModeChange: PropTypes?.func?.isRequired
};

export default PricingModeSelector;