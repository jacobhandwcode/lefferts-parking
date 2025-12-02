'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};

export const ParkingProvider = ({ children }) => {
  // Parking Lots Configuration (static for now, could be fetched from API)
  const parkingLots = [
    { id: 'pacs', name: 'Pacs', capacity: 150, address: 'Pacs Parking Lot' },
    { id: '11st', name: '11 ST', capacity: 120, address: '11 ST Parking Lot' },
    { id: '54flagler', name: '54 Flagler', capacity: 200, address: '54 Flagler Parking Lot' },
    { id: '18lincoln', name: '18 Lincoln', capacity: 100, address: '18 Lincoln Parking Lot' },
    { id: '72park', name: '72 Park', capacity: 180, address: '72 Park Parking Lot' }
  ];

  // Global State
  const [selectedLot, setSelectedLot] = useState('pacs');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  });
  const [userInfo, setUserInfo] = useState({
    name: 'John Manager',
    role: 'Facility Admin',
    email: 'john.manager@lfparking.com',
    permissions: ['admin', 'view', 'edit', 'delete']
  });

  // Dynamic Data States
  const [permits, setPermits] = useState([]);
  const [violations, setViolations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [occupancyData, setOccupancyData] = useState({});
  const [pricingRules, setPricingRules] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [revenueData, setRevenueData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Functions
  const fetchOccupancy = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/occupancy');
      const data = await response.json();
      
      if (response.ok) {
        const occupancy = {};
        data.current.forEach(lot => {
          occupancy[lot.lotId] = {
            current: lot.currentOccupancy,
            available: lot.availableSpaces
          };
        });
        setOccupancyData(occupancy);
      }
    } catch (error) {
      console.error('Failed to fetch occupancy:', error);
      setError('Failed to load occupancy data');
    }
  }, []);

  const fetchPermits = useCallback(async (type = null) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      params.append('status', 'active');
      params.append('limit', '100');

      const response = await fetch(`/api/parking/permits?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setPermits(data.permits);
      }
    } catch (error) {
      console.error('Failed to fetch permits:', error);
      setError('Failed to load permits');
    }
  }, []);

  const fetchViolations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'issued');
      params.append('limit', '50');

      const response = await fetch(`/api/vanguard/violations?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setViolations(data.violations);
      }
    } catch (error) {
      console.error('Failed to fetch violations:', error);
      setError('Failed to load violations');
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', dateRange.start.toISOString());
      params.append('endDate', dateRange.end.toISOString());
      params.append('limit', '100');

      const response = await fetch(`/api/analytics/transactions?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions');
    }
  }, [dateRange]);

  const fetchNotifications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'pending');
      params.append('limit', '20');

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to load notifications');
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('status', 'active');
      if (selectedLot) params.append('lot', selectedLot);

      const response = await fetch(`/api/parking/sessions?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError('Failed to load sessions');
    }
  }, [selectedLot]);

  const fetchPricing = useCallback(async () => {
    try {
      const response = await fetch('/api/parking/pricing?active=true');
      const data = await response.json();
      
      if (response.ok) {
        setPricingRules(data.rules);
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
      setError('Failed to load pricing rules');
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/revenue');
      const data = await response.json();
      
      if (response.ok) {
        setRevenueData(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
      setError('Failed to load revenue data');
    }
  }, []);

  // API Write Functions
  const createPermit = async (permitData) => {
    try {
      const response = await fetch('/api/parking/permits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permitData)
      });
      
      if (response.ok) {
        await fetchPermits(); // Refresh permits
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to create permit:', error);
      return { success: false, error: 'Failed to create permit' };
    }
  };

  const updatePermit = async (permitId, updateData) => {
    try {
      const response = await fetch('/api/parking/permits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: permitId, ...updateData })
      });
      
      if (response.ok) {
        await fetchPermits(); // Refresh permits
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to update permit:', error);
      return { success: false, error: 'Failed to update permit' };
    }
  };

  const processPayment = async (paymentData) => {
    try {
      const response = await fetch('/api/parking/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (response.ok) {
        await Promise.all([
          fetchSessions(),
          fetchTransactions(),
          fetchViolations()
        ]);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
      return { success: false, error: 'Failed to process payment' };
    }
  };

  const createViolation = async (violationData) => {
    try {
      const response = await fetch('/api/vanguard/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violationData)
      });
      
      if (response.ok) {
        await fetchViolations();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to create violation:', error);
      return { success: false, error: 'Failed to create violation' };
    }
  };

  const updateNotificationStatus = async (notificationId, status) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, status })
      });
      
      if (response.ok) {
        await fetchNotifications();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to update notification:', error);
      return { success: false, error: 'Failed to update notification' };
    }
  };

  // Helper Functions
  const getLotById = (lotId) => {
    return parkingLots.find(lot => lot.id === lotId);
  };

  const getLotOccupancy = (lotId) => {
    return occupancyData[lotId] || { current: 0, available: 0 };
  };

  const getLotOccupancyPercentage = (lotId) => {
    const lot = getLotById(lotId);
    const occupancy = getLotOccupancy(lotId);
    if (!lot) return 0;
    return Math.round((occupancy.current / lot.capacity) * 100);
  };

  const updateSelectedLot = (lotId) => {
    if (parkingLots.find(lot => lot.id === lotId)) {
      setSelectedLot(lotId);
    }
  };

  const updateDateRange = (start, end) => {
    setDateRange({ start, end });
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchOccupancy(),
          fetchPermits(),
          fetchViolations(),
          fetchNotifications(),
          fetchSessions(),
          fetchPricing(),
          fetchRevenue()
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Refresh data when selectedLot or dateRange changes
  useEffect(() => {
    fetchSessions();
  }, [selectedLot, fetchSessions]);

  useEffect(() => {
    fetchTransactions();
  }, [dateRange, fetchTransactions]);

  // Auto-refresh critical data
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOccupancy();
      fetchNotifications();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [fetchOccupancy, fetchNotifications]);

  const value = {
    // Core Data
    parkingLots,
    selectedLot,
    dateRange,
    userInfo,
    
    // API Data
    permits,
    violations,
    transactions,
    notifications,
    occupancyData,
    pricingRules,
    sessions,
    revenueData,
    
    // State
    loading,
    error,
    
    // Functions
    setSelectedLot: updateSelectedLot,
    setDateRange: updateDateRange,
    setUserInfo,
    
    // API Functions
    fetchOccupancy,
    fetchPermits,
    fetchViolations,
    fetchTransactions,
    fetchNotifications,
    fetchSessions,
    fetchPricing,
    fetchRevenue,
    
    // Write Functions
    createPermit,
    updatePermit,
    processPayment,
    createViolation,
    updateNotificationStatus,
    
    // Helper Functions
    getLotById,
    getLotOccupancy,
    getLotOccupancyPercentage
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};