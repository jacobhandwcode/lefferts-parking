'use client';

import React from 'react';
import PropTypes from 'prop-types';
import NotificationCard from './NotificationCard';
import Icon from '@/components/ui/AppIcon';

const NotificationsList = ({ 
  notifications, 
  selectedNotifications, 
  onSelectNotification, 
  onAccept, 
  onClose 
}) => {
  if (notifications?.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg p-12 text-center">
        <Icon name="BellSlashIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No notifications found</h3>
        <p className="text-muted-foreground">
          There are no notifications matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {notifications?.map(notification => (
        <div key={notification?.id} className="flex items-start space-x-3 mb-4">
          <div className="pt-4">
            <input
              type="checkbox"
              checked={selectedNotifications?.includes(notification?.id)}
              onChange={() => onSelectNotification(notification?.id)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="flex-1">
            <NotificationCard
              notification={notification}
              onAccept={onAccept}
              onClose={onClose}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

NotificationsList.propTypes = {
  notifications: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    type: PropTypes?.oneOf(['car_validation', 'price_change', 'new_booking', 'ticket_dismissal'])?.isRequired,
    title: PropTypes?.string?.isRequired,
    message: PropTypes?.string?.isRequired,
    urgency: PropTypes?.oneOf(['critical', 'high', 'medium', 'low'])?.isRequired,
    location: PropTypes?.string?.isRequired,
    licensePlate: PropTypes?.string,
    bookingRef: PropTypes?.string,
    timestamp: PropTypes?.string?.isRequired,
    status: PropTypes?.oneOf(['pending', 'accepted', 'closed'])?.isRequired
  }))?.isRequired,
  selectedNotifications: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
  onSelectNotification: PropTypes?.func?.isRequired,
  onAccept: PropTypes?.func?.isRequired,
  onClose: PropTypes?.func?.isRequired
};

export default NotificationsList;