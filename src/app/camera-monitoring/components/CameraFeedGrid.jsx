import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CameraFeedGrid = ({ cameras, selectedLocation, onCameraSelect }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cameras?.map((camera) => (
        <div
          key={camera?.id}
          className="bg-white border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => onCameraSelect(camera)}
        >
          {/* Camera Feed */}
          <div className="relative aspect-video bg-gray-900">
            {camera?.status === 'online' ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon name="VideoCameraIcon" size={32} className="mx-auto mb-2 opacity-60" />
                  <div className="text-sm font-medium">Live Feed</div>
                  <div className="text-xs opacity-60">{camera?.name}</div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Icon name="VideoCameraSlashIcon" size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">
                    {camera?.status === 'offline' ? 'Offline' : 'Maintenance'}
                  </div>
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-2 left-2">
              <div className={`flex items-center space-x-1 px-2 py-1 bg-black/60 rounded-full text-xs ${getCameraStatusColor(camera?.status)}`}>
                <Icon name={getCameraStatusIcon(camera?.status)} size={12} />
                <span className="capitalize">{camera?.status}</span>
              </div>
            </div>

            {/* Timestamp */}
            {camera?.status === 'online' && (
              <div className="absolute bottom-2 left-2">
                <div className="px-2 py-1 bg-black/60 rounded text-xs text-white font-mono">
                  {camera?.lastUpdate}
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {camera?.isRecording && camera?.status === 'online' && (
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-600 rounded-full text-xs text-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Info */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm text-foreground">{camera?.name}</h3>
                <p className="text-xs text-muted-foreground">{camera?.location}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="EyeIcon" size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{camera?.viewers}</span>
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 hover:bg-muted rounded transition-micro"
                  title="Zoom"
                >
                  <Icon name="MagnifyingGlassPlusIcon" size={14} className="text-muted-foreground" />
                </button>
                <button
                  className="p-1 hover:bg-muted rounded transition-micro"
                  title="Fullscreen"
                >
                  <Icon name="ArrowsPointingOutIcon" size={14} className="text-muted-foreground" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                Camera {camera?.id}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CameraFeedGrid.propTypes = {
  cameras: PropTypes?.arrayOf(
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
  selectedLocation: PropTypes?.string?.isRequired,
  onCameraSelect: PropTypes?.func?.isRequired
};

export default CameraFeedGrid;