'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Icon from '@/components/ui/AppIcon';

const AllLotSummaryInteractive = ({ initialData }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState(initialData?.timeRange);
  const [selectedLot, setSelectedLot] = useState(null);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    console.log('Date range updated:', newRange);
  };

  const handleLotSelect = (lotId) => {
    setSelectedLot(selectedLot === lotId ? null : lotId);
    console.log('Selected lot:', lotId);
  };

  const handleExport = () => {
    console.log('Exporting all lot summary data...');
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," + "Lot Name,Total Revenue,Revenue,Bookings,Enforcement Revenue,Tickets Paid,Tickets Issued\n" +
      initialData?.parkingLots?.map(lot => 
        `${lot?.name},${lot?.metrics?.totalRevenue},${lot?.metrics?.revenue},${lot?.metrics?.bookings},${lot?.metrics?.enforcementRevenue},${lot?.metrics?.ticketsPaid},${lot?.metrics?.ticketIssued}`
      )?.join("\n") +
      `\nTotals,${initialData?.totals?.totalRevenue},${initialData?.totals?.revenue},${initialData?.totals?.bookings},${initialData?.totals?.enforcementRevenue},${initialData?.totals?.ticketsPaid},${initialData?.totals?.ticketIssued}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `all-lot-summary-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
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

  const MetricButton = ({ label, value, type = 'currency', isActive = false, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
        isActive
          ? 'border-primary bg-primary/10 shadow-md'
          : 'border-border bg-white hover:bg-surface hover:shadow-soft'
      }`}
    >
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground">
        {type === 'currency' ? formatCurrency(value) : value?.toLocaleString?.() || 0}
      </div>
    </button>
  );

  const LotSection = ({ lot, isSelected }) => (
    <div className={`bg-white rounded-lg border p-6 transition-all duration-200 ${
      isSelected ? 'border-primary shadow-md' : 'border-border'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">{lot?.name}</h3>
        <button
          onClick={() => handleLotSelect(lot?.id)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Icon 
            name={isSelected ? 'EyeSlashIcon' : 'EyeIcon'} 
            size={20} 
          />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <MetricButton
            label="Total Revenue"
            value={lot?.metrics?.totalRevenue}
            isActive={isSelected}
            onClick={() => console.log('Total Revenue clicked for', lot?.name)}
          />
          <MetricButton
            label="Revenue"
            value={lot?.metrics?.revenue}
            isActive={isSelected}
            onClick={() => console.log('Revenue clicked for', lot?.name)}
          />
          <MetricButton
            label="Bookings"
            value={lot?.metrics?.bookings}
            type="number"
            isActive={isSelected}
            onClick={() => console.log('Bookings clicked for', lot?.name)}
          />
        </div>
        
        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">
          <MetricButton
            label="Enforcement Revenue"
            value={lot?.metrics?.enforcementRevenue}
            isActive={isSelected}
            onClick={() => console.log('Enforcement Revenue clicked for', lot?.name)}
          />
          <MetricButton
            label="Tickets Paid"
            value={lot?.metrics?.ticketsPaid}
            type="number"
            isActive={isSelected}
            onClick={() => console.log('Tickets Paid clicked for', lot?.name)}
          />
          <MetricButton
            label="Ticket Issued"
            value={lot?.metrics?.ticketIssued}
            type="number"
            isActive={isSelected}
            onClick={() => console.log('Ticket Issued clicked for', lot?.name)}
          />
        </div>
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
                <h1 className="text-2xl font-bold text-foreground mb-2">All Lot Summary</h1>
                <p className="text-muted-foreground">
                  Comparative performance analysis across all parking locations
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
            <div className="flex items-center justify-between bg-white rounded-lg border border-border p-4 mb-6">
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
            </div>
          </div>

          {/* Parking Lots Sections */}
          <div className="space-y-6 mb-8">
            {initialData?.parkingLots?.map((lot) => (
              <LotSection
                key={lot?.id}
                lot={lot}
                isSelected={selectedLot === lot?.id}
              />
            ))}
          </div>

          {/* Totals Section */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20 p-6">
            <div className="flex items-center mb-6">
              <Icon name="CalculatorIcon" size={24} className="text-primary mr-3" />
              <h3 className="text-xl font-bold text-foreground">Totals</h3>
            </div>
            
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-4">
                <MetricButton
                  label="Total Revenue"
                  value={initialData?.totals?.totalRevenue}
                  onClick={() => console.log('Total Revenue (Totals) clicked')}
                />
                <MetricButton
                  label="Revenue"
                  value={initialData?.totals?.revenue}
                  onClick={() => console.log('Revenue (Totals) clicked')}
                />
                <MetricButton
                  label="Bookings"
                  value={initialData?.totals?.bookings}
                  type="number"
                  onClick={() => console.log('Bookings (Totals) clicked')}
                />
              </div>
              
              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-4">
                <MetricButton
                  label="Enforcement Revenue"
                  value={initialData?.totals?.enforcementRevenue}
                  onClick={() => console.log('Enforcement Revenue (Totals) clicked')}
                />
                <MetricButton
                  label="Tickets Paid"
                  value={initialData?.totals?.ticketsPaid}
                  type="number"
                  onClick={() => console.log('Tickets Paid (Totals) clicked')}
                />
                <MetricButton
                  label="Ticket Issued"
                  value={initialData?.totals?.ticketIssued}
                  type="number"
                  onClick={() => console.log('Ticket Issued (Totals) clicked')}
                />
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="mt-6 pt-6 border-t border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Revenue per Lot</span>
                    <Icon name="ChartBarIcon" size={16} className="text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency((initialData?.totals?.revenue || 0) / (initialData?.parkingLots?.length || 1))}
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Highest Performing Lot</span>
                    <Icon name="TrophyIcon" size={16} className="text-warning" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {initialData?.parkingLots?.reduce((max, lot) => 
                      (lot?.metrics?.totalRevenue || 0) > (max?.metrics?.totalRevenue || 0) ? lot : max, 
                      initialData?.parkingLots?.[0] || {}
                    )?.name || 'N/A'}
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Overall Collection Rate</span>
                    <Icon name="CheckCircleIcon" size={16} className="text-success" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {Math.round(((initialData?.totals?.ticketsPaid || 0) / (initialData?.totals?.ticketIssued || 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

AllLotSummaryInteractive.propTypes = {
  initialData: PropTypes?.shape({
    timeRange: PropTypes?.shape({
      start: PropTypes?.string?.isRequired,
      end: PropTypes?.string?.isRequired
    })?.isRequired,
    parkingLots: PropTypes?.arrayOf(PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      metrics: PropTypes?.shape({
        totalRevenue: PropTypes?.number?.isRequired,
        revenue: PropTypes?.number?.isRequired,
        bookings: PropTypes?.number?.isRequired,
        enforcementRevenue: PropTypes?.number?.isRequired,
        ticketsPaid: PropTypes?.number?.isRequired,
        ticketIssued: PropTypes?.number?.isRequired
      })?.isRequired
    }))?.isRequired,
    totals: PropTypes?.shape({
      totalRevenue: PropTypes?.number?.isRequired,
      revenue: PropTypes?.number?.isRequired,
      bookings: PropTypes?.number?.isRequired,
      enforcementRevenue: PropTypes?.number?.isRequired,
      ticketsPaid: PropTypes?.number?.isRequired,
      ticketIssued: PropTypes?.number?.isRequired
    })?.isRequired
  })?.isRequired
};

export default AllLotSummaryInteractive;