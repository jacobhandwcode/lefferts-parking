'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LocationSelector from './LocationSelector';
import ViewModeToggle from './ViewModeToggle';
import CameraStats from './CameraStats';
import CameraFeedGrid from './CameraFeedGrid';
import CameraSingleView from './CameraSingleView';
import Icon from '@/components/ui/AppIcon';


const CameraMonitoringInteractive = ({ initialData }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialData?.locations?.[0]?.id);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get cameras for selected location
  const getLocationCameras = (locationId) => {
    return initialData?.cameras?.filter(camera => camera?.locationId === locationId);
  };

  const currentLocationCameras = getLocationCameras(selectedLocation);

  // Calculate stats for current location
  const calculateStats = (cameras) => {
    return {
      totalCameras: cameras?.length,
      onlineCameras: cameras?.filter(cam => cam?.status === 'online')?.length,
      offlineCameras: cameras?.filter(cam => cam?.status === 'offline')?.length,
      recordingCameras: cameras?.filter(cam => cam?.isRecording)?.length
    };
  };

  const currentStats = calculateStats(currentLocationCameras);

  const handleLocationChange = (locationId) => {
    setSelectedLocation(locationId);
    setViewMode('grid');
    setSelectedCamera(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'single' && currentLocationCameras?.length > 0) {
      setSelectedCamera(currentLocationCameras?.[0]);
    } else if (mode === 'grid') {
      setSelectedCamera(null);
    }
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
    setViewMode('single');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedCamera(null);
  };

  const handleCameraChange = (camera) => {
    setSelectedCamera(camera);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Camera Monitoring</h1>
              <p className="text-muted-foreground mt-1">
                Real-time surveillance across all parking locations
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <LocationSelector
                locations={initialData?.locations}
                selectedLocation={selectedLocation}
                onLocationChange={handleLocationChange}
                cameraCount={currentLocationCameras?.length}
              />
              <ViewModeToggle
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            </div>
          </div>

          {/* Camera Statistics */}
          <CameraStats stats={currentStats} />

          {/* Main Content Area */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-soft">
            {viewMode === 'grid' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {initialData?.locations?.find(loc => loc?.id === selectedLocation)?.name} Cameras
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {currentLocationCameras?.length} cameras • Last updated: {currentTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {currentLocationCameras?.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span>Live Feed Active</span>
                    </div>
                  )}
                </div>

                {currentLocationCameras?.length > 0 ? (
                  <CameraFeedGrid
                    cameras={currentLocationCameras}
                    selectedLocation={selectedLocation}
                    onCameraSelect={handleCameraSelect}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="VideoCameraSlashIcon" size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Cameras Available</h3>
                    <p className="text-muted-foreground">
                      There are no cameras configured for this location.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              selectedCamera && (
                <CameraSingleView
                  camera={selectedCamera}
                  allCameras={currentLocationCameras}
                  onBackToGrid={handleBackToGrid}
                  onCameraChange={handleCameraChange}
                />
              )
            )}
          </div>
      </div>
    </div>
  );
};

CameraMonitoringInteractive.propTypes = {
  initialData: PropTypes?.shape({
    locations: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.string?.isRequired,
        name: PropTypes?.string?.isRequired,
        address: PropTypes?.string?.isRequired,
        status: PropTypes?.oneOf(['active', 'maintenance'])?.isRequired,
        cameraCount: PropTypes?.number?.isRequired
      })
    )?.isRequired,
    cameras: PropTypes?.arrayOf(
      PropTypes?.shape({
        id: PropTypes?.number?.isRequired,
        name: PropTypes?.string?.isRequired,
        location: PropTypes?.string?.isRequired,
        locationId: PropTypes?.string?.isRequired,
        status: PropTypes?.oneOf(['online', 'offline', 'maintenance'])?.isRequired,
        lastUpdate: PropTypes?.string?.isRequired,
        isRecording: PropTypes?.bool?.isRequired,
        viewers: PropTypes?.number?.isRequired
      })
    )?.isRequired
  })?.isRequired
};

export default CameraMonitoringInteractive;