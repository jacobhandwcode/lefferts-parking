import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CameraStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Cameras',
      value: stats?.totalCameras,
      icon: 'VideoCameraIcon',
      color: 'text-primary'
    },
    {
      label: 'Online',
      value: stats?.onlineCameras,
      icon: 'CheckCircleIcon',
      color: 'text-success'
    },
    {
      label: 'Offline',
      value: stats?.offlineCameras,
      icon: 'XCircleIcon',
      color: 'text-error'
    },
    {
      label: 'Recording',
      value: stats?.recordingCameras,
      icon: 'PlayCircleIcon',
      color: 'text-warning'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-white border border-border rounded-lg p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item?.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{item?.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-surface ${item?.color}`}>
              <Icon name={item?.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CameraStats.propTypes = {
  stats: PropTypes?.shape({
    totalCameras: PropTypes?.number?.isRequired,
    onlineCameras: PropTypes?.number?.isRequired,
    offlineCameras: PropTypes?.number?.isRequired,
    recordingCameras: PropTypes?.number?.isRequired
  })?.isRequired
};

export default CameraStats;