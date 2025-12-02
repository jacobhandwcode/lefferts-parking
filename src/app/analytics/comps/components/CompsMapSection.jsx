'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CompsMapSection = ({ 
  title, 
  data, 
  mapConfig, 
  selectedItem, 
  onItemSelect, 
  mapFilters,
  mapType 
}) => {
  const [mapView, setMapView] = useState('satellite');
  const [zoomLevel, setZoomLevel] = useState(mapConfig?.zoom || 12);

  const handleMapClick = (item) => {
    onItemSelect?.(item);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 8));
  };

  const getMarkerColor = (item) => {
    if (mapType === 'comps') {
      // Color based on occupancy rate for COMPS
      if (item?.occupancyRate >= 90) return 'bg-red-500';
      if (item?.occupancyRate >= 80) return 'bg-yellow-500';
      return 'bg-green-500';
    } else {
      // Color based on event type for Updates
      const eventType = item?.event?.toLowerCase();
      if (eventType?.includes('price')) return 'bg-red-500';
      if (eventType?.includes('expansion') || eventType?.includes('upgrade')) return 'bg-blue-500';
      if (eventType?.includes('closure') || eventType?.includes('maintenance')) return 'bg-orange-500';
      return 'bg-purple-500';
    }
  };

  const getMarkerSize = (item) => {
    if (mapType === 'comps') {
      return item?.pricePerHr > 5 ? 'w-4 h-4' : 'w-3 h-3';
    }
    return 'w-3 h-3';
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow-soft border border-border">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-muted transition-colors rounded-t-lg"
          >
            <Icon name="PlusIcon" size={16} className="text-muted-foreground" />
          </button>
          <div className="px-3 py-1 border-t border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">{zoomLevel}</span>
          </div>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-muted transition-colors rounded-b-lg"
          >
            <Icon name="MinusIcon" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Map View Toggle */}
        <div className="bg-white rounded-lg shadow-soft border border-border">
          <button
            onClick={() => setMapView('satellite')}
            className={`p-2 transition-colors rounded-t-lg ${
              mapView === 'satellite' ? 'bg-primary text-white' : 'hover:bg-muted'
            }`}
          >
            <Icon name="GlobeAltIcon" size={16} />
          </button>
          <button
            onClick={() => setMapView('roadmap')}
            className={`p-2 transition-colors rounded-b-lg ${
              mapView === 'roadmap' ? 'bg-primary text-white' : 'hover:bg-muted'
            }`}
          >
            <Icon name="MapIcon" size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-soft border border-border p-3">
        <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
        {mapType === 'comps' ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">&lt;80% Occupancy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">80-89% Occupancy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">90%+ Occupancy</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Pricing Changes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Expansions/Upgrades</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Other Events</span>
            </div>
          </div>
        )}
      </div>

      {/* Mock Map Display */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {/* Mock Street Grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Mock streets */}
          <rect x="80" y="0" width="4" height="300" fill="#9ca3af" />
          <rect x="200" y="0" width="4" height="300" fill="#9ca3af" />
          <rect x="320" y="0" width="4" height="300" fill="#9ca3af" />
          <rect x="0" y="100" width="400" height="4" fill="#9ca3af" />
          <rect x="0" y="200" width="400" height="4" fill="#9ca3af" />
        </svg>

        {/* Mock Location Markers */}
        {data?.map((item, index) => {
          const x = 50 + (index * 60) % 300;
          const y = 50 + Math.floor(index / 5) * 80;
          const isSelected = selectedItem?.id === item?.id;

          return (
            <button
              key={item?.id}
              onClick={() => handleMapClick(item)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                isSelected ? 'scale-125 z-10' : 'hover:scale-110'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
              title={item?.parkingLot}
            >
              <div className={`${getMarkerColor(item)} ${getMarkerSize(item)} rounded-full border-2 ${
                isSelected ? 'border-white shadow-lg' : 'border-gray-300'
              }`}>
              </div>
              {isSelected && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-border px-2 py-1 whitespace-nowrap">
                  <div className="text-xs font-semibold text-foreground">{item?.parkingLot}</div>
                  {mapType === 'comps' && (
                    <div className="text-xs text-muted-foreground">
                      ${item?.pricePerHr}/hr • {item?.occupancyRate}%
                    </div>
                  )}
                  {mapType === 'updates' && (
                    <div className="text-xs text-muted-foreground">
                      {item?.event} • {item?.date}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {/* Center Point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Map Info Panel */}
      <div className="p-4 bg-surface border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>View: {mapView === 'satellite' ? 'Satellite' : 'Road Map'}</span>
          <span>Zoom: {zoomLevel}x</span>
          <span>{data?.length} locations</span>
        </div>
      </div>
    </div>
  );
};

CompsMapSection.propTypes = {
  title: PropTypes?.string?.isRequired,
  data: PropTypes?.array?.isRequired,
  mapConfig: PropTypes?.shape({
    center: PropTypes?.shape({
      lat: PropTypes?.number?.isRequired,
      lng: PropTypes?.number?.isRequired
    })?.isRequired,
    zoom: PropTypes?.number?.isRequired,
    mapType: PropTypes?.string?.isRequired
  })?.isRequired,
  selectedItem: PropTypes?.object,
  onItemSelect: PropTypes?.func,
  mapFilters: PropTypes?.object?.isRequired,
  mapType: PropTypes?.oneOf(['comps', 'updates'])?.isRequired
};

export default CompsMapSection;