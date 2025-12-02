'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Icon from '@/components/ui/AppIcon';

const TransientSummaryInteractive = ({ initialData }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState(initialData?.timeRange);
  const [selectedView, setSelectedView] = useState('today');

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    console.log('Date range updated:', newRange);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    console.log('View changed to:', view);
  };

  const handleExport = () => {
    console.log('Exporting transient summary data...');
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," + "Metric,Value\n"+ "Total Revenue,$"+ initialData?.overallMetrics?.totalRevenue + "\n" + "Total Surcharge,$"+ initialData?.overallMetrics?.totalSurcharge + "\n" + "Total Sales Tax,$"+ initialData?.overallMetrics?.totalSalesTax + "\n" + "Total Net Revenue,$" + initialData?.overallMetrics?.totalNetRevenue;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `transient-summary-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(amount || 0);
  };

  const MetricCard = ({ title, value, type = 'currency', trend, bgColor = 'bg-white' }) => (
    <div className={`${bgColor} rounded-lg border border-border p-6 shadow-soft`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {trend && (
          <div className={`flex items-center text-xs ${
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend > 0 ? 'ArrowUpIcon' : trend < 0 ? 'ArrowDownIcon' : 'MinusIcon'} 
              size={12} 
              className="mr-1" 
            />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">
        {type === 'currency' ? formatCurrency(value) : value?.toLocaleString?.() || 0}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-72'
      } pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Transient Summary</h1>
                <p className="text-muted-foreground">
                  Comprehensive transient parking performance analysis and metrics
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="ArrowDownTrayIcon" size={16} className="mr-2" />
                Export
              </button>
            </div>

            {/* Time Period Header */}
            <div className="flex items-center justify-between bg-white rounded-lg border border-border p-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Time Period: {dateRange?.start} - {dateRange?.end}
                </h2>
                <div className="flex items-center space-x-2">
                  <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
                  <input
                    type="date"
                    value={dateRange?.start}
                    onChange={(e) => handleDateRangeChange({ ...dateRange, start: e?.target?.value })}
                    className="px-3 py-1 border border-border rounded text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="date"
                    value={dateRange?.end}
                    onChange={(e) => handleDateRangeChange({ ...dateRange, end: e?.target?.value })}
                    className="px-3 py-1 border border-border rounded text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {['today', 'week', 'month', 'year']?.map((view) => (
                  <button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                      selectedView === view
                        ? 'bg-primary text-white' :'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Overall Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={initialData?.overallMetrics?.totalRevenue}
                trend={12.5}
                bgColor="bg-primary/5"
              />
              <MetricCard
                title="Total Surcharge"
                value={initialData?.overallMetrics?.totalSurcharge}
                trend={8.3}
                bgColor="bg-secondary/5"
              />
              <MetricCard
                title="Total Sales Tax"
                value={initialData?.overallMetrics?.totalSalesTax}
                trend={6.7}
                bgColor="bg-success/5"
              />
              <MetricCard
                title="Total Net Revenue"
                value={initialData?.overallMetrics?.totalNetRevenue}
                trend={14.2}
                bgColor="bg-warning/5"
              />
            </div>
          </div>

          {/* Transient Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Transient Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Revenue"
                value={initialData?.transientMetrics?.revenue}
                trend={15.8}
              />
              <MetricCard
                title="Surcharge"
                value={initialData?.transientMetrics?.surcharge}
                trend={9.2}
              />
              <MetricCard
                title="Sales Tax"
                value={initialData?.transientMetrics?.salesTax}
                trend={7.5}
              />
              <MetricCard
                title="Net Revenue"
                value={initialData?.transientMetrics?.netRevenue}
                trend={16.3}
              />
              <MetricCard
                title="Bookings"
                value={initialData?.transientMetrics?.bookings}
                type="number"
                trend={22.1}
              />
            </div>
          </div>

          {/* Enforcement Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Enforcement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <MetricCard
                title="Revenue"
                value={initialData?.enforcementMetrics?.revenue}
                trend={4.2}
              />
              <MetricCard
                title="Surcharge"
                value={initialData?.enforcementMetrics?.surcharge}
                trend={2.8}
              />
              <MetricCard
                title="Sales Tax"
                value={initialData?.enforcementMetrics?.salesTax}
                trend={3.1}
              />
              <MetricCard
                title="Net Revenue"
                value={initialData?.enforcementMetrics?.netRevenue}
                trend={5.7}
              />
              <MetricCard
                title="Violations Sent/Paid"
                value={`${initialData?.enforcementMetrics?.violationsSent}/${initialData?.enforcementMetrics?.violationsPaid}`}
                type="text"
                trend={-1.3}
              />
            </div>
          </div>

          {/* Additional Analytics Section */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Performance Summary</h3>
              <div className="flex items-center space-x-2">
                <Icon name="InformationCircleIcon" size={16} className="text-info" />
                <span className="text-sm text-muted-foreground">Real-time data updates every 15 minutes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Average Transaction Value</span>
                  <Icon name="CurrencyDollarIcon" size={16} className="text-success" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {formatCurrency((initialData?.transientMetrics?.revenue || 0) / (initialData?.transientMetrics?.bookings || 1))}
                </div>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Collection Rate</span>
                  <Icon name="CheckCircleIcon" size={16} className="text-success" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {Math.round(((initialData?.enforcementMetrics?.violationsPaid || 0) / (initialData?.enforcementMetrics?.violationsSent || 1)) * 100)}%
                </div>
              </div>
              
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Revenue Mix</span>
                  <Icon name="ChartPieIcon" size={16} className="text-primary" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {Math.round(((initialData?.transientMetrics?.revenue || 0) / (initialData?.overallMetrics?.totalRevenue || 1)) * 100)}% Transient
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

TransientSummaryInteractive.propTypes = {
  initialData: PropTypes?.shape({
    timeRange: PropTypes?.shape({
      start: PropTypes?.string?.isRequired,
      end: PropTypes?.string?.isRequired
    })?.isRequired,
    overallMetrics: PropTypes?.shape({
      totalRevenue: PropTypes?.number?.isRequired,
      totalSurcharge: PropTypes?.number?.isRequired,
      totalSalesTax: PropTypes?.number?.isRequired,
      totalNetRevenue: PropTypes?.number?.isRequired
    })?.isRequired,
    transientMetrics: PropTypes?.shape({
      revenue: PropTypes?.number?.isRequired,
      surcharge: PropTypes?.number?.isRequired,
      salesTax: PropTypes?.number?.isRequired,
      netRevenue: PropTypes?.number?.isRequired,
      bookings: PropTypes?.number?.isRequired
    })?.isRequired,
    enforcementMetrics: PropTypes?.shape({
      revenue: PropTypes?.number?.isRequired,
      surcharge: PropTypes?.number?.isRequired,
      salesTax: PropTypes?.number?.isRequired,
      netRevenue: PropTypes?.number?.isRequired,
      violationsSent: PropTypes?.number?.isRequired,
      violationsPaid: PropTypes?.number?.isRequired
    })?.isRequired
  })?.isRequired
};

export default TransientSummaryInteractive;