'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CameraSingleView = ({ camera, allCameras, onBackToGrid, onCameraChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handlePreviousCamera = () => {
    const currentIndex = allCameras?.findIndex(cam => cam?.id === camera?.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : allCameras?.length - 1;
    onCameraChange(allCameras?.[previousIndex]);
  };

  const handleNextCamera = () => {
    const currentIndex = allCameras?.findIndex(cam => cam?.id === camera?.id);
    const nextIndex = currentIndex < allCameras?.length - 1 ? currentIndex + 1 : 0;
    onCameraChange(allCameras?.[nextIndex]);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCameraStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-success';
      case 'offline':
        return 'text-error';
      case 'maintenance':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getCameraStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return 'CheckCircleIcon';
      case 'offline':
        return 'XCircleIcon';
      case 'maintenance':
        return 'ExclamationTriangleIcon';
      default:
        return 'QuestionMarkCircleIcon';
    }
  };

  return (
    <div className={`bg-white border border-border rounded-lg overflow-hidden shadow-soft ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header Controls */}
      <div className={`flex items-center justify-between p-4 border-b border-border bg-surface ${!showControls && isFullscreen ? 'opacity-0 pointer-events-none' : ''} transition-opacity`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToGrid}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="ArrowLeftIcon" size={16} />
            <span>Back to Grid</span>
          </button>
          
          <div className="h-4 w-px bg-border"></div>
          
          <div className="flex items-center space-x-2">
            <Icon name={getCameraStatusIcon(camera?.status)} size={16} className={getCameraStatusColor(camera?.status)} />
            <div>
              <h2 className="font-semibold text-foreground">{camera?.name}</h2>
              <p className="text-sm text-muted-foreground">{camera?.location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Camera Navigation */}
          <div className="flex items-center space-x-1 bg-white border border-border rounded-lg">
            <button
              onClick={handlePreviousCamera}
              className="p-2 hover:bg-muted transition-micro"
              title="Previous Camera"
            >
              <Icon name="ChevronLeftIcon" size={16} className="text-muted-foreground" />
            </button>
            <div className="px-3 py-2 text-sm font-medium text-foreground border-x border-border">
              {allCameras?.findIndex(cam => cam?.id === camera?.id) + 1} of {allCameras?.length}
            </div>
            <button
              onClick={handleNextCamera}
              className="p-2 hover:bg-muted transition-micro"
              title="Next Camera"
            >
              <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* View Controls */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Icon 
              name={isFullscreen ? "ArrowsPointingInIcon" : "ArrowsPointingOutIcon"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
            title={showControls ? 'Hide Controls' : 'Show Controls'}
          >
            <Icon name="EyeSlashIcon" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Main Video Feed */}
      <div className="relative bg-gray-900" style={{ aspectRatio: '16/9' }}>
        {camera?.status === 'online' ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon name="VideoCameraIcon" size={64} className="mx-auto mb-4 opacity-60" />
              <div className="text-xl font-medium mb-2">Live Camera Feed</div>
              <div className="text-lg opacity-80">{camera?.name}</div>
              <div className="text-sm opacity-60 mt-2">High Definition Stream</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Icon name="VideoCameraSlashIcon" size={64} className="mx-auto mb-4" />
              <div className="text-xl font-medium mb-2">
                {camera?.status === 'offline' ? 'Camera Offline' : 'Under Maintenance'}
              </div>
              <div className="text-sm opacity-60">
                {camera?.status === 'offline' ?'Please check connection and try again' :'Camera will be back online shortly'
                }
              </div>
            </div>
          </div>
        )}

        {/* Overlay Information */}
        <div className={`absolute inset-0 ${!showControls && isFullscreen ? 'opacity-0 pointer-events-none' : ''} transition-opacity`}>
          {/* Top Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="flex flex-col space-y-2">
              {/* Status */}
              <div className={`flex items-center space-x-2 px-3 py-2 bg-black/60 rounded-lg text-sm ${getCameraStatusColor(camera?.status)}`}>
                <Icon name={getCameraStatusIcon(camera?.status)} size={16} />
                <span className="capitalize font-medium">{camera?.status}</span>
              </div>

              {/* Recording Indicator */}
              {camera?.isRecording && camera?.status === 'online' && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-red-600 rounded-lg text-sm text-white">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-medium">RECORDING</span>
                </div>
              )}
            </div>

            {/* Viewers Count */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-black/60 rounded-lg text-sm text-white">
              <Icon name="EyeIcon" size={16} />
              <span>{camera?.viewers} viewers</span>
            </div>
          </div>

          {/* Bottom Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            {/* Timestamp */}
            {camera?.status === 'online' && (
              <div className="px-3 py-2 bg-black/60 rounded-lg text-white font-mono">
                <div className="text-lg font-medium">{camera?.lastUpdate}</div>
                <div className="text-xs opacity-80">Live Stream</div>
              </div>
            )}

            {/* Camera Controls */}
            <div className="flex items-center space-x-2">
              <button className="p-3 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-micro" title="Zoom In">
                <Icon name="MagnifyingGlassPlusIcon" size={20} />
              </button>
              <button className="p-3 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-micro" title="Zoom Out">
                <Icon name="MagnifyingGlassMinusIcon" size={20} />
              </button>
              <button className="p-3 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-micro" title="Take Screenshot">
                <Icon name="CameraIcon" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Camera Information Panel */}
      {!isFullscreen && (
        <div className="p-4 bg-surface border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Camera Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Camera ID:</span>
                  <span className="font-mono text-foreground">{camera?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="text-foreground">1920x1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frame Rate:</span>
                  <span className="text-foreground">30 FPS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Connection</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal Strength:</span>
                  <span className="text-success font-medium">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="text-foreground">45ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="text-foreground">99.8%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Activity</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Motion:</span>
                  <span className="text-foreground">2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alerts Today:</span>
                  <span className="text-warning font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Used:</span>
                  <span className="text-foreground">2.4 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CameraSingleView.propTypes = {
  camera: PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    name: PropTypes?.string?.isRequired,
    location: PropTypes?.string?.isRequired,
    status: PropTypes?.oneOf(['online', 'offline', 'maintenance'])?.isRequired,
    lastUpdate: PropTypes?.string?.isRequired,
    isRecording: PropTypes?.bool?.isRequired,
    viewers: PropTypes?.number?.isRequired
  })?.isRequired,
  allCameras: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      location: PropTypes?.string?.isRequired,
      status: PropTypes?.oneOf(['online', 'offline', 'maintenance'])?.isRequired,
      lastUpdate: PropTypes?.string?.isRequired,
      isRecording: PropTypes?.bool?.isRequired,
      viewers: PropTypes?.number?.isRequired
    })
  )?.isRequired,
  onBackToGrid: PropTypes?.func?.isRequired,
  onCameraChange: PropTypes?.func?.isRequired
};

export default CameraSingleView;