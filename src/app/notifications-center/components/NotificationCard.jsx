'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const NotificationCard = ({ notification, onAccept, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'car_validation':
        return 'ExclamationTriangleIcon';
      case 'price_change':
        return 'CurrencyDollarIcon';
      case 'new_booking':
        return 'CalendarIcon';
      case 'ticket_dismissal':
        return 'DocumentTextIcon';
      default:
        return 'BellIcon';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'border-l-error bg-error/5';
      case 'high':
        return 'border-l-warning bg-warning/5';
      case 'medium':
        return 'border-l-primary bg-primary/5';
      case 'low':
        return 'border-l-muted-foreground bg-muted';
      default:
        return 'border-l-muted-foreground bg-white';
    }
  };

  const getUrgencyTextColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`border-l-4 ${getUrgencyColor(notification?.urgency)} border border-border rounded-lg p-4 mb-4 transition-micro hover:shadow-soft`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${notification?.urgency === 'critical' ? 'bg-error/10' : notification?.urgency === 'high' ? 'bg-warning/10' : 'bg-primary/10'}`}>
            <Icon 
              name={getNotificationIcon(notification?.type)} 
              size={20} 
              className={getUrgencyTextColor(notification?.urgency)} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground">{notification?.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getUrgencyTextColor(notification?.urgency)} bg-current/10`}>
                {notification?.urgency?.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{notification?.message}</p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPinIcon" size={14} />
                <span>{notification?.location}</span>
              </div>
              {notification?.licensePlate && (
                <div className="flex items-center space-x-1">
                  <Icon name="TruckIcon" size={14} />
                  <span className="font-mono">{notification?.licensePlate}</span>
                </div>
              )}
              {notification?.bookingRef && (
                <div className="flex items-center space-x-1">
                  <Icon name="HashtagIcon" size={14} />
                  <span className="font-mono">{notification?.bookingRef}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Icon name="ClockIcon" size={14} />
                <span>{formatTimestamp(notification?.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {notification?.status === 'pending' && (
            <>
              <button
                onClick={() => onAccept(notification?.id)}
                className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-success/90 transition-micro"
              >
                Accept
              </button>
              <button
                onClick={() => onClose(notification?.id)}
                className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-lg hover:bg-muted/80 transition-micro"
              >
                Close
              </button>
            </>
          )}
          {notification?.status === 'accepted' && (
            <span className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg">
              Accepted
            </span>
          )}
          {notification?.status === 'closed' && (
            <span className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-medium rounded-lg">
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationCard.propTypes = {
  notification: PropTypes?.shape({
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
  })?.isRequired,
  onAccept: PropTypes?.func?.isRequired,
  onClose: PropTypes?.func?.isRequired
};

export default NotificationCard;