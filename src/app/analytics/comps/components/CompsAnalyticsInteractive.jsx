'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import CompsMapSection from './CompsMapSection';
import CompsDataTable from './CompsDataTable';
import UpdatesDataTable from './UpdatesDataTable';
import Icon from '@/components/ui/AppIcon';

const CompsAnalyticsInteractive = ({ 
  compsData, 
  updatesData, 
  mapConfig 
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [mapFilters, setMapFilters] = useState({
    showPricing: true,
    showOccupancy: true,
    showUpdates: true
  });

  const handleCompetitorSelect = (competitor) => {
    setSelectedCompetitor(competitor);
    console.log('Selected competitor:', competitor);
  };

  const handleUpdateSelect = (update) => {
    setSelectedUpdate(update);
    console.log('Selected update:', update);
  };

  const handleMapFilterChange = (filterType, value) => {
    setMapFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExportComps = () => {
    // Mock export functionality for COMPS data
    const csvContent = "data:text/csv;charset=utf-8," + "Parking Lot,Address,Price per Hr,Occupancy Rate\n" +
      compsData?.map(row => 
        `"${row?.parkingLot}","${row?.address}",${row?.pricePerHr},${row?.occupancyRate}`
      )?.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `comps-analysis-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleExportUpdates = () => {
    // Mock export functionality for Updates data
    const csvContent = "data:text/csv;charset=utf-8," + "Parking Lot,Event,Date,Time\n" +
      updatesData?.map(row => 
        `"${row?.parkingLot}","${row?.event}",${row?.date},${row?.time}`
      )?.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link?.setAttribute("href", encodedUri);
    link?.setAttribute("download", `market-updates-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

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
            <h1 className="text-2xl font-bold text-foreground mb-2">COMPS Analysis</h1>
            <p className="text-muted-foreground">
              Competitive analysis through side-by-side visual mapping and data comparison tools for strategic market positioning
            </p>
          </div>

          {/* Map Filters */}
          <div className="mb-6 bg-white rounded-lg border border-border p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Map Display Options</h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters?.showPricing}
                  onChange={(e) => handleMapFilterChange('showPricing', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-foreground">Pricing Zones</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters?.showOccupancy}
                  onChange={(e) => handleMapFilterChange('showOccupancy', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-foreground">Occupancy Heat Map</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mapFilters?.showUpdates}
                  onChange={(e) => handleMapFilterChange('showUpdates', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-white border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-foreground">Recent Updates</span>
              </label>
            </div>
          </div>

          {/* Dual Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* COMPS Map */}
            <div className="bg-white rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">COMPS</h3>
                <p className="text-sm text-muted-foreground">Competitor locations and market analysis</p>
              </div>
              <CompsMapSection
                title="Competitive Analysis"
                data={compsData}
                mapConfig={mapConfig}
                selectedItem={selectedCompetitor}
                onItemSelect={handleCompetitorSelect}
                mapFilters={mapFilters}
                mapType="comps"
              />
            </div>

            {/* Updates Map */}
            <div className="bg-white rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Updates</h3>
                <p className="text-sm text-muted-foreground">Recent market changes and events</p>
              </div>
              <CompsMapSection
                title="Market Updates"
                data={updatesData}
                mapConfig={mapConfig}
                selectedItem={selectedUpdate}
                onItemSelect={handleUpdateSelect}
                mapFilters={mapFilters}
                mapType="updates"
              />
            </div>
          </div>

          {/* Data Tables Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* COMPS Table */}
            <div className="bg-white rounded-lg border border-border">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">COMPS Data</h3>
                  <p className="text-sm text-muted-foreground">Competitive parking facility comparison</p>
                </div>
                <button
                  onClick={handleExportComps}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Icon name="ArrowDownTrayIcon" size={16} />
                  <span>Export</span>
                </button>
              </div>
              <CompsDataTable
                data={compsData}
                selectedItem={selectedCompetitor}
                onItemSelect={handleCompetitorSelect}
              />
            </div>

            {/* Updates Table */}
            <div className="bg-white rounded-lg border border-border">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Updates Data</h3>
                  <p className="text-sm text-muted-foreground">Recent market events and changes</p>
                </div>
                <button
                  onClick={handleExportUpdates}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Icon name="ArrowDownTrayIcon" size={16} />
                  <span>Export</span>
                </button>
              </div>
              <UpdatesDataTable
                data={updatesData}
                selectedItem={selectedUpdate}
                onItemSelect={handleUpdateSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

CompsAnalyticsInteractive.propTypes = {
  compsData: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    parkingLot: PropTypes?.string?.isRequired,
    address: PropTypes?.string?.isRequired,
    pricePerHr: PropTypes?.number?.isRequired,
    occupancyRate: PropTypes?.number?.isRequired,
    lat: PropTypes?.number?.isRequired,
    lng: PropTypes?.number?.isRequired
  }))?.isRequired,
  updatesData: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    parkingLot: PropTypes?.string?.isRequired,
    event: PropTypes?.string?.isRequired,
    date: PropTypes?.string?.isRequired,
    time: PropTypes?.string?.isRequired,
    lat: PropTypes?.number?.isRequired,
    lng: PropTypes?.number?.isRequired
  }))?.isRequired,
  mapConfig: PropTypes?.shape({
    center: PropTypes?.shape({
      lat: PropTypes?.number?.isRequired,
      lng: PropTypes?.number?.isRequired
    })?.isRequired,
    zoom: PropTypes?.number?.isRequired,
    mapType: PropTypes?.string?.isRequired
  })?.isRequired
};

export default CompsAnalyticsInteractive;