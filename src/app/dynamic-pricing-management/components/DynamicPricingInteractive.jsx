'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WeeklyCalendarNav from './WeeklyCalendarNav';
import PricingModeSelector from './PricingModeSelector';
import FixedHourlyConfig from './FixedHourlyConfig';
import ProgressivePriceConfig from './ProgressivePriceConfig';
import TimeWindowConfig from './TimeWindowConfig';
import PricingActions from './PricingActions';
import SurgePricingModal from './SurgePricingModal';
import EventCouponModal from './EventCouponModal';

const DynamicPricingInteractive = ({ initialData }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('Pacs');
  const [selectedMode, setSelectedMode] = useState('fixed');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSurgeModal, setShowSurgeModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Pricing configurations for different modes
  const [pricingConfigs, setPricingConfigs] = useState({
    fixed: {
      standardRate: 5.00,
      maxDailyRate: 25.00,
      gracePeriod: 15,
      includeTax: false
    },
    progressive: {
      tiers: [
        { hours: 2, rate: 4.00 },
        { hours: 4, rate: 6.00 },
        { hours: 8, rate: 8.00 }
      ],
      maxDailyRate: 30.00,
      includeTax: false
    },
    timewindow: {
      timeWindows: [
        {
          name: 'Peak Hours',
          startTime: '08:00',
          endTime: '18:00',
          rate: 8.00,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        {
          name: 'Evening',
          startTime: '18:00',
          endTime: '22:00',
          rate: 5.00,
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
      ],
      defaultRate: 3.00,
      maxDailyRate: 25.00,
      includeTax: false
    }
  });

  useEffect(() => {
    // Initialize current week to start of week
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart?.setDate(today?.getDate() - today?.getDay());
    setCurrentWeek(currentWeekStart);
  }, []);

  const handleWeekChange = (newWeek) => {
    setCurrentWeek(newWeek);
    setHasUnsavedChanges(true);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setHasUnsavedChanges(true);
  };

  const handleConfigChange = (newConfig) => {
    setPricingConfigs(prev => ({
      ...prev,
      [selectedMode]: newConfig
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate save operation
    console.log('Saving pricing configuration:', {
      week: currentWeek,
      location: selectedLocation,
      mode: selectedMode,
      config: pricingConfigs?.[selectedMode]
    });
    
    setHasUnsavedChanges(false);
    
    // Show success message (in real app, this would be a toast notification)
    alert('Pricing configuration saved successfully!');
  };

  const handleCopyWeek = (copyData) => {
    console.log('Copying week configuration:', copyData);
    alert(`Configuration copied to ${copyData?.targetWeeks?.length} weeks for ${copyData?.locations?.length} locations`);
  };

  const handleCreateTemplate = (templateData) => {
    console.log('Creating template:', templateData);
    alert(`Template "${templateData?.name}" created successfully!`);
  };

  const handleSurgeSave = (surgeConfig) => {
    console.log('Saving surge pricing configuration:', surgeConfig);
    alert('Surge pricing configuration saved!');
  };

  const handleEventCouponSave = (couponData) => {
    console.log('Creating event coupon:', couponData);
    alert(`Event coupon "${couponData?.name}" created successfully!`);
  };

  const renderPricingConfig = () => {
    switch (selectedMode) {
      case 'fixed':
        return (
          <FixedHourlyConfig
            config={pricingConfigs?.fixed}
            onConfigChange={handleConfigChange}
          />
        );
      case 'progressive':
        return (
          <ProgressivePriceConfig
            config={pricingConfigs?.progressive}
            onConfigChange={handleConfigChange}
          />
        );
      case 'timewindow':
        return (
          <TimeWindowConfig
            config={pricingConfigs?.timewindow}
            onConfigChange={handleConfigChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Dynamic Pricing Management</h1>
              <p className="text-muted-foreground">
                Configure and optimize pricing strategies across all locations
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Last updated:</span>
              <span className="font-medium text-foreground">
                {new Date()?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Weekly Calendar Navigation */}
          <WeeklyCalendarNav
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
            selectedLocation={selectedLocation}
          />

          {/* Pricing Mode Selection */}
          <PricingModeSelector
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />

          {/* Pricing Configuration */}
          {renderPricingConfig()}

          {/* Pricing Actions */}
          <PricingActions
            onSave={handleSave}
            onCopyWeek={handleCopyWeek}
            onCreateTemplate={handleCreateTemplate}
            onSurgeModal={() => setShowSurgeModal(true)}
            onEventCoupon={() => setShowEventModal(true)}
            hasUnsavedChanges={hasUnsavedChanges}
          />
      {/* Modals */}
      <SurgePricingModal
        isOpen={showSurgeModal}
        onClose={() => setShowSurgeModal(false)}
        onSave={handleSurgeSave}
      />
      <EventCouponModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleEventCouponSave}
      />
    </div>
  );
};

DynamicPricingInteractive.propTypes = {
  initialData: PropTypes?.object?.isRequired
};

export default DynamicPricingInteractive;