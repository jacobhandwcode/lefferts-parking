import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const EnforcementStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total_tickets',
      title: 'Total Tickets',
      value: stats?.totalTickets,
      change: '+12%',
      changeType: 'increase',
      icon: 'DocumentTextIcon',
      color: 'text-primary'
    },
    {
      id: 'revenue_collected',
      title: 'Revenue Collected',
      value: `$${stats?.revenueCollected?.toLocaleString()}`,
      change: '+8%',
      changeType: 'increase',
      icon: 'CurrencyDollarIcon',
      color: 'text-success'
    },
    {
      id: 'pending_tickets',
      title: 'Pending Tickets',
      value: stats?.pendingTickets,
      change: '-5%',
      changeType: 'decrease',
      icon: 'ClockIcon',
      color: 'text-warning'
    },
    {
      id: 'collection_rate',
      title: 'Collection Rate',
      value: `${stats?.collectionRate}%`,
      change: '+3%',
      changeType: 'increase',
      icon: 'ChartBarIcon',
      color: 'text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((card) => (
        <div key={card?.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-soft transition-micro">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg bg-surface ${card?.color}`}>
              <Icon name={card?.icon} size={20} />
            </div>
            <div className={`flex items-center space-x-1 text-xs ${
              card?.changeType === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={card?.changeType === 'increase' ? 'ArrowUpIcon' : 'ArrowDownIcon'} 
                size={12} 
              />
              <span>{card?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-foreground">
              {card?.value}
            </h3>
            <p className="text-sm text-muted-foreground">
              {card?.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

EnforcementStats.propTypes = {
  stats: PropTypes?.shape({
    totalTickets: PropTypes?.number?.isRequired,
    revenueCollected: PropTypes?.number?.isRequired,
    pendingTickets: PropTypes?.number?.isRequired,
    collectionRate: PropTypes?.number?.isRequired
  })?.isRequired
};

export default EnforcementStats;