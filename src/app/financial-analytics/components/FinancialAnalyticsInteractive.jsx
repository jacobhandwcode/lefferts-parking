'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AnalyticsFilters from './AnalyticsFilters';
import RevenueHeatMap from './RevenueHeatMap';
import RevenueBarChart from './RevenueBarChart';
import TrendAnalysis from './TrendAnalysis';

const FinancialAnalyticsInteractive = ({ 
  initialFilters, 
  heatMapData, 
  chartData, 
  trendData, 
  benchmarkData 
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [chartType, setChartType] = useState('location');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // In a real app, this would trigger data refetch
    console.log('Filters updated:', newFilters);
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting financial data...');
    const exportData = {
      filters,
      timestamp: new Date()?.toISOString(),
      data: {
        heatMap: heatMapData,
        charts: chartData,
        trends: trendData
      }
    };
    
    // Create and download mock CSV
    const csvContent = "data:text/csv;charset=utf-8," + "Location,Revenue,Transactions,Occupancy\n" +
      chartData?.map(row => `${row?.name},${row?.revenue},${row?.transactions},${row?.occupancy}`)?.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `financial-analytics-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleScheduleReport = () => {
    // Mock schedule report functionality
    console.log('Scheduling automated report...');
    alert('Report scheduled successfully! You will receive weekly financial analytics reports every Monday at 9:00 AM.');
  };

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId);
    console.log('Selected location:', locationId);
  };

  const handleChartTypeChange = (newChartType) => {
    setChartType(newChartType);
    console.log('Chart type changed to:', newChartType);
  };

  return (
    <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Financial Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive revenue analysis and financial performance insights across all parking locations
            </p>
          </div>

          {/* Analytics Filters */}
          <AnalyticsFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onScheduleReport={handleScheduleReport}
          />

          {/* Revenue Heat Map */}
          <div className="mb-6">
            <RevenueHeatMap
              data={heatMapData}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Revenue Bar Chart */}
          <div className="mb-6">
            <RevenueBarChart
              data={chartData}
              chartType={chartType}
              onChartTypeChange={handleChartTypeChange}
            />
          </div>

          {/* Trend Analysis */}
          <TrendAnalysis
            trendData={trendData}
            benchmarkData={benchmarkData}
          />
    </div>
  );
};

FinancialAnalyticsInteractive.propTypes = {
  initialFilters: PropTypes?.shape({
    timeframe: PropTypes?.string?.isRequired,
    selectedLocation: PropTypes?.string?.isRequired,
    revenueCategory: PropTypes?.string?.isRequired,
    comparisonTimeframe: PropTypes?.string?.isRequired,
    dateRange: PropTypes?.shape({
      startDate: PropTypes?.string?.isRequired,
      endDate: PropTypes?.string?.isRequired
    })?.isRequired
  })?.isRequired,
  heatMapData: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    name: PropTypes?.string?.isRequired,
    totalRevenue: PropTypes?.number?.isRequired,
    timeData: PropTypes?.arrayOf(PropTypes?.shape({
      period: PropTypes?.string?.isRequired,
      revenue: PropTypes?.number?.isRequired,
      transactions: PropTypes?.number?.isRequired
    }))?.isRequired
  }))?.isRequired,
  chartData: PropTypes?.arrayOf(PropTypes?.shape({
    name: PropTypes?.string?.isRequired,
    revenue: PropTypes?.number?.isRequired,
    transactions: PropTypes?.number?.isRequired,
    occupancy: PropTypes?.number?.isRequired
  }))?.isRequired,
  trendData: PropTypes?.arrayOf(PropTypes?.shape({
    period: PropTypes?.string?.isRequired,
    revenue: PropTypes?.number?.isRequired,
    growth: PropTypes?.number?.isRequired
  }))?.isRequired,
  benchmarkData: PropTypes?.arrayOf(PropTypes?.shape({
    metric: PropTypes?.string?.isRequired,
    actual: PropTypes?.number?.isRequired,
    target: PropTypes?.number?.isRequired,
    type: PropTypes?.oneOf(['currency', 'percentage'])?.isRequired
  }))?.isRequired
};

export default FinancialAnalyticsInteractive;