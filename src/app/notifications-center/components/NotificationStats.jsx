import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const NotificationStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total Notifications',
      value: stats?.total,
      icon: 'BellIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'pending',
      label: 'Pending Action',
      value: stats?.pending,
      icon: 'ClockIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'critical',
      label: 'Critical Alerts',
      value: stats?.critical,
      icon: 'ExclamationTriangleIcon',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      id: 'resolved',
      label: 'Resolved Today',
      value: stats?.resolved,
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map(stat => (
        <div key={stat?.id} className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat?.label}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stat?.value?.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

NotificationStats.propTypes = {
  stats: PropTypes?.shape({
    total: PropTypes?.number?.isRequired,
    pending: PropTypes?.number?.isRequired,
    critical: PropTypes?.number?.isRequired,
    resolved: PropTypes?.number?.isRequired
  })?.isRequired
};

export default NotificationStats;