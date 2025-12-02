'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const LocationSelector = ({ locations, selectedLocation, onLocationChange, cameraCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsOpen(false);
  };

  const selectedLocationData = locations?.find(loc => loc?.id === selectedLocation);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-80 px-4 py-3 bg-white border border-border rounded-lg hover:bg-muted transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Icon name="MapPinIcon" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium text-foreground">
              {selectedLocationData?.name || 'Select Location'}
            </div>
            <div className="text-sm text-muted-foreground">
              {cameraCount} cameras available
            </div>
          </div>
        </div>
        <Icon 
          name="ChevronDownIcon" 
          size={20} 
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-soft z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
              Parking Locations
            </div>
            {locations?.map((location) => (
              <button
                key={location?.id}
                onClick={() => handleLocationSelect(location?.id)}
                className={`w-full flex items-center justify-between px-3 py-3 text-left hover:bg-muted transition-micro ${
                  selectedLocation === location?.id ? 'bg-primary/5 border-r-2 border-primary' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon 
                      name="BuildingOfficeIcon" 
                      size={18} 
                      className={selectedLocation === location?.id ? 'text-primary' : 'text-muted-foreground'} 
                    />
                  </div>
                  <div>
                    <div className={`font-medium ${
                      selectedLocation === location?.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {location?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {location?.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    location?.status === 'active' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      location?.status === 'active' ? 'bg-success' : 'bg-warning'
                    }`}></div>
                    <span className="capitalize">{location?.status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {location?.cameraCount} cams
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

LocationSelector.propTypes = {
  locations: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      name: PropTypes?.string?.isRequired,
      address: PropTypes?.string?.isRequired,
      status: PropTypes?.oneOf(['active', 'maintenance'])?.isRequired,
      cameraCount: PropTypes?.number?.isRequired
    })
  )?.isRequired,
  selectedLocation: PropTypes?.string?.isRequired,
  onLocationChange: PropTypes?.func?.isRequired,
  cameraCount: PropTypes?.number?.isRequired
};

export default LocationSelector;