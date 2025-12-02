import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const KPICard = ({ title, value, trend, trendValue, icon, color = 'primary' }) => {
  const getTrendColor = (trendType) => {
    switch (trendType) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      case 'neutral':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case 'up':
        return 'ArrowTrendingUpIcon';
      case 'down':
        return 'ArrowTrendingDownIcon';
      case 'neutral':
        return 'MinusIcon';
      default:
        return 'MinusIcon';
    }
  };

  const getColorClasses = (colorType) => {
    switch (colorType) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'error':
        return 'bg-error/10 text-error';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-soft hover:shadow-md transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
            <Icon name={getTrendIcon(trend)} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

KPICard.propTypes = {
  title: PropTypes?.string?.isRequired,
  value: PropTypes?.oneOfType([PropTypes?.string, PropTypes?.number])?.isRequired,
  trend: PropTypes?.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes?.string,
  icon: PropTypes?.string?.isRequired,
  color: PropTypes?.oneOf(['primary', 'success', 'warning', 'error'])
};

export default KPICard;