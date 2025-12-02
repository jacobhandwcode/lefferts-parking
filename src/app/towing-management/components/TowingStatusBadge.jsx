import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TowingStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-warning/10 text-warning border-warning/20',
          icon: 'ClockIcon'
        };
      case 'dispatched':
        return {
          label: 'Dispatched',
          className: 'bg-primary/10 text-primary border-primary/20',
          icon: 'TruckIcon'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          className: 'bg-secondary/10 text-secondary border-secondary/20',
          icon: 'ArrowPathIcon'
        };
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-success/10 text-success border-success/20',
          icon: 'CheckCircleIcon'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-error/10 text-error border-error/20',
          icon: 'XCircleIcon'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-muted text-muted-foreground border-border',
          icon: 'QuestionMarkCircleIcon'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config?.className}`}>
      <Icon name={config?.icon} size={12} />
      <span>{config?.label}</span>
    </span>
  );
};

TowingStatusBadge.propTypes = {
  status: PropTypes?.oneOf(['pending', 'dispatched', 'in-progress', 'completed', 'cancelled'])?.isRequired
};

export default TowingStatusBadge;