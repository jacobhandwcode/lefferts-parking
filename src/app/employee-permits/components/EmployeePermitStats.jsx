import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const EmployeePermitStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total Employee Permits',
      value: stats?.totalPermits,
      icon: 'IdentificationIcon',
      color: 'bg-primary',
      change: stats?.totalChange,
      changeType: 'positive'
    },
    {
      id: 'active',
      label: 'Active Permits',
      value: stats?.activePermits,
      icon: 'CheckCircleIcon',
      color: 'bg-success',
      change: stats?.activeChange,
      changeType: 'positive'
    },
    {
      id: 'departments',
      label: 'Departments',
      value: stats?.departments,
      icon: 'BuildingOfficeIcon',
      color: 'bg-secondary',
      change: stats?.departmentChange,
      changeType: 'neutral'
    },
    {
      id: 'vehicles',
      label: 'Registered Vehicles',
      value: stats?.totalVehicles,
      icon: 'TruckIcon',
      color: 'bg-accent',
      change: stats?.vehicleChange,
      changeType: 'positive'
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((stat) => (
        <div key={stat?.id} className="bg-white rounded-lg border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className="text-white" />
            </div>
            {stat?.change && (
              <div className={`flex items-center space-x-1 ${getChangeColor(stat?.changeType)}`}>
                <Icon 
                  name={stat?.changeType === 'positive' ? 'ArrowUpIcon' : stat?.changeType === 'negative' ? 'ArrowDownIcon' : 'MinusIcon'} 
                  size={16} 
                />
                <span className="text-sm font-medium">{stat?.change}</span>
              </div>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {typeof stat?.value === 'number' ? stat?.value?.toLocaleString() : stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat?.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

EmployeePermitStats.propTypes = {
  stats: PropTypes?.shape({
    totalPermits: PropTypes?.number?.isRequired,
    activePermits: PropTypes?.number?.isRequired,
    departments: PropTypes?.number?.isRequired,
    totalVehicles: PropTypes?.number?.isRequired,
    totalChange: PropTypes?.string,
    activeChange: PropTypes?.string,
    departmentChange: PropTypes?.string,
    vehicleChange: PropTypes?.string
  })?.isRequired
};

export default EmployeePermitStats;