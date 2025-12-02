import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TransactionSummary = ({ summaryData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount || 0);
  };

  const summaryCards = [
    {
      title: 'Total Transactions',
      value: summaryData?.totalTransactions?.toLocaleString(),
      icon: 'DocumentTextIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summaryData?.totalRevenue),
      icon: 'CurrencyDollarIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Average Transaction',
      value: formatCurrency(summaryData?.averageTransaction),
      icon: 'ChartBarIcon',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Completed',
      value: summaryData?.completedTransactions?.toLocaleString(),
      icon: 'CheckCircleIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending',
      value: summaryData?.pendingTransactions?.toLocaleString(),
      icon: 'ClockIcon',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Failed',
      value: summaryData?.failedTransactions?.toLocaleString(),
      icon: 'XCircleIcon',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {summaryCards?.map((card, index) => (
        <div key={index} className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{card?.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card?.bgColor}`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

TransactionSummary.propTypes = {
  summaryData: PropTypes?.shape({
    totalTransactions: PropTypes?.number?.isRequired,
    totalRevenue: PropTypes?.number?.isRequired,
    averageTransaction: PropTypes?.number?.isRequired,
    completedTransactions: PropTypes?.number?.isRequired,
    pendingTransactions: PropTypes?.number?.isRequired,
    failedTransactions: PropTypes?.number?.isRequired
  })?.isRequired
};

export default TransactionSummary;