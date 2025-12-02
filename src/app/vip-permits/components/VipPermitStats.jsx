import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const VipPermitStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total VIP Permits',
      value: stats?.total,
      icon: 'StarIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'active',
      label: 'Active Permits',
      value: stats?.active,
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'companies',
      label: 'Partner Companies',
      value: stats?.companies,
      icon: 'BuildingOfficeIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'vehicles',
      label: 'Registered Vehicles',
      value: stats?.vehicles,
      icon: 'TruckIcon',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((card) => (
        <div key={card?.id} className="bg-white rounded-lg border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card?.label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card?.value?.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

VipPermitStats.propTypes = {
  stats: PropTypes?.shape({
    total: PropTypes?.number?.isRequired,
    active: PropTypes?.number?.isRequired,
    companies: PropTypes?.number?.isRequired,
    vehicles: PropTypes?.number?.isRequired
  })?.isRequired
};

export default VipPermitStats;