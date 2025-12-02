'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NotificationStats from './NotificationStats';
import NotificationFilters from './NotificationFilters';
import BulkActions from './BulkActions';
import NotificationsList from './NotificationsList';

const NotificationsCenterInteractive = ({ initialNotifications, initialStats }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [stats, setStats] = useState(initialStats);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    urgency: 'all',
    status: 'all'
  });

  // Filter notifications based on current filters
  const filteredNotifications = notifications?.filter(notification => {
    if (filters?.type !== 'all' && notification?.type !== filters?.type) return false;
    if (filters?.location !== 'all' && notification?.location !== filters?.location) return false;
    if (filters?.urgency !== 'all' && notification?.urgency !== filters?.urgency) return false;
    if (filters?.status !== 'all' && notification?.status !== filters?.status) return false;
    return true;
  });

  // Update stats when notifications change
  useEffect(() => {
    const newStats = {
      total: notifications?.length,
      pending: notifications?.filter(n => n?.status === 'pending')?.length,
      critical: notifications?.filter(n => n?.urgency === 'critical')?.length,
      resolved: notifications?.filter(n => n?.status === 'accepted' || n?.status === 'closed')?.length
    };
    setStats(newStats);
  }, [notifications]);

  const handleAcceptNotification = (notificationId) => {
    setNotifications(prev => prev?.map(notification =>
      notification?.id === notificationId
        ? { ...notification, status: 'accepted' }
        : notification
    ));
    setSelectedNotifications(prev => prev?.filter(id => id !== notificationId));
  };

  const handleCloseNotification = (notificationId) => {
    setNotifications(prev => prev?.map(notification =>
      notification?.id === notificationId
        ? { ...notification, status: 'closed' }
        : notification
    ));
    setSelectedNotifications(prev => prev?.filter(id => id !== notificationId));
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev?.includes(notificationId)) {
        return prev?.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleSelectAll = () => {
    const pendingNotifications = filteredNotifications?.filter(n => n?.status === 'pending')?.map(n => n?.id);
    setSelectedNotifications(pendingNotifications);
  };

  const handleDeselectAll = () => {
    setSelectedNotifications([]);
  };

  const handleBulkAccept = () => {
    setNotifications(prev => prev?.map(notification =>
      selectedNotifications?.includes(notification?.id)
        ? { ...notification, status: 'accepted' }
        : notification
    ));
    setSelectedNotifications([]);
  };

  const handleBulkClose = () => {
    setNotifications(prev => prev?.map(notification =>
      selectedNotifications?.includes(notification?.id)
        ? { ...notification, status: 'closed' }
        : notification
    ));
    setSelectedNotifications([]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setSelectedNotifications([]);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      location: 'all',
      urgency: 'all',
      status: 'all'
    });
    setSelectedNotifications([]);
  };

  return (
    <div className="space-y-6">
      <NotificationStats stats={stats} />
      <NotificationFilters
        selectedType={filters?.type}
        selectedLocation={filters?.location}
        selectedUrgency={filters?.urgency}
        selectedStatus={filters?.status}
        onTypeChange={(value) => handleFilterChange('type', value)}
        onLocationChange={(value) => handleFilterChange('location', value)}
        onUrgencyChange={(value) => handleFilterChange('urgency', value)}
        onStatusChange={(value) => handleFilterChange('status', value)}
        onClearFilters={handleClearFilters}
      />
      <BulkActions
        selectedNotifications={selectedNotifications}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkAccept={handleBulkAccept}
        onBulkClose={handleBulkClose}
        totalNotifications={filteredNotifications?.length}
      />
      <NotificationsList
        notifications={filteredNotifications}
        selectedNotifications={selectedNotifications}
        onSelectNotification={handleSelectNotification}
        onAccept={handleAcceptNotification}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

NotificationsCenterInteractive.propTypes = {
  initialNotifications: PropTypes?.arrayOf(PropTypes?.shape({
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
  initialStats: PropTypes?.shape({
    total: PropTypes?.number?.isRequired,
    pending: PropTypes?.number?.isRequired,
    critical: PropTypes?.number?.isRequired,
    resolved: PropTypes?.number?.isRequired
  })?.isRequired
};

export default NotificationsCenterInteractive;