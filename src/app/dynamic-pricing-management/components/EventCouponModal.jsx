'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const EventCouponModal = ({ isOpen, onClose, onSave }) => {
  const [couponData, setCouponData] = useState({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: 0,
    minPurchase: 0,
    validFrom: '',
    validTo: '',
    unlimitedDuration: false,
    usageLimit: 100,
    unlimitedUsage: false,
    locations: [],
    conditions: {
      firstTimeUsers: false,
      weekendsOnly: false,
      peakHours: false,
      multipleHours: false
    }
  });

  const locations = [
    'Pacs',
    '11 ST',
    '54 Flagler',
    '18 Lincoln',
    '72 Park'
  ];

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setCouponData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionChange = (condition, value) => {
    setCouponData(prev => ({
      ...prev,
      conditions: {
        ...prev?.conditions,
        [condition]: value
      }
    }));
  };

  const toggleLocation = (location) => {
    setCouponData(prev => ({
      ...prev,
      locations: prev?.locations?.includes(location)
        ? prev?.locations?.filter(l => l !== location)
        : [...prev?.locations, location]
    }));
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    handleInputChange('code', code);
  };

  const handleSave = () => {
    if (couponData?.name && couponData?.code && couponData?.locations?.length > 0) {
      onSave(couponData);
      onClose();
      // Reset form
      setCouponData({
        name: '',
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        maxDiscount: 0,
        minPurchase: 0,
        validFrom: '',
        validTo: '',
        unlimitedDuration: false,
        usageLimit: 100,
        unlimitedUsage: false,
        locations: [],
        conditions: {
          firstTimeUsers: false,
          weekendsOnly: false,
          peakHours: false,
          multipleHours: false
        }
      });
    }
  };

  const calculateDiscount = (amount) => {
    if (couponData?.discountType === 'percentage') {
      const discount = (amount * couponData?.discountValue) / 100;
      return couponData?.maxDiscount > 0 ? Math.min(discount, couponData?.maxDiscount) : discount;
    } else {
      return Math.min(couponData?.discountValue, amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create Event Coupon</h2>
              <p className="text-sm text-muted-foreground">
                Set up promotional discounts for special events
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-micro"
            >
              <Icon name="XMarkIcon" size={24} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Coupon Name
              </label>
              <input
                type="text"
                value={couponData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Holiday Special"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponData?.code}
                  onChange={(e) => handleInputChange('code', e?.target?.value?.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                  placeholder="HOLIDAY2024"
                />
                <button
                  onClick={generateCouponCode}
                  className="px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-micro"
                >
                  <Icon name="ArrowPathIcon" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={couponData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
              placeholder="Describe the promotion and terms..."
            />
          </div>

          {/* Discount Configuration */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Discount Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Discount Type
                </label>
                <select
                  value={couponData?.discountType}
                  onChange={(e) => handleInputChange('discountType', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Discount Value
                </label>
                <div className="relative">
                  {couponData?.discountType === 'percentage' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                  )}
                  {couponData?.discountType === 'fixed' && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  )}
                  <input
                    type="number"
                    min="0"
                    step={couponData?.discountType === 'percentage' ? '1' : '0.25'}
                    max={couponData?.discountType === 'percentage' ? '100' : undefined}
                    value={couponData?.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e?.target?.value) || 0)}
                    className={`w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      couponData?.discountType === 'fixed' ? 'pl-8' : 'pr-8'
                    }`}
                  />
                </div>
              </div>

              {couponData?.discountType === 'percentage' && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Max Discount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={couponData?.maxDiscount}
                    onChange={(e) => handleInputChange('maxDiscount', parseFloat(e?.target?.value) || 0)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0 = unlimited"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Validity Period */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Validity Period</h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={couponData?.unlimitedDuration}
                  onChange={(e) => handleInputChange('unlimitedDuration', e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Unlimited duration</span>
              </label>

              {!couponData?.unlimitedDuration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Valid From
                    </label>
                    <input
                      type="datetime-local"
                      value={couponData?.validFrom}
                      onChange={(e) => handleInputChange('validFrom', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Valid To
                    </label>
                    <input
                      type="datetime-local"
                      value={couponData?.validTo}
                      onChange={(e) => handleInputChange('validTo', e?.target?.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Limits */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Usage Limits</h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={couponData?.unlimitedUsage}
                  onChange={(e) => handleInputChange('unlimitedUsage', e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground">Unlimited usage</span>
              </label>

              {!couponData?.unlimitedUsage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={couponData?.usageLimit}
                      onChange={(e) => handleInputChange('usageLimit', parseInt(e?.target?.value) || 1)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Minimum Purchase ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      value={couponData?.minPurchase}
                      onChange={(e) => handleInputChange('minPurchase', parseFloat(e?.target?.value) || 0)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Valid Locations</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {locations?.map((location) => (
                <label key={location} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponData?.locations?.includes(location)}
                    onChange={() => toggleLocation(location)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Conditions */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Additional Conditions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                firstTimeUsers: 'First-time users only',
                weekendsOnly: 'Weekends only',
                peakHours: 'Peak hours only',
                multipleHours: 'Multiple hours required'
              })?.map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponData?.conditions?.[key]}
                    onChange={(e) => handleConditionChange(key, e?.target?.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-surface rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-3">Discount Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">$10.00:</span>
                <span className="ml-2 font-medium text-success">
                  -${calculateDiscount(10)?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">$25.00:</span>
                <span className="ml-2 font-medium text-success">
                  -${calculateDiscount(25)?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">$50.00:</span>
                <span className="ml-2 font-medium text-success">
                  -${calculateDiscount(50)?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">$100.00:</span>
                <span className="ml-2 font-medium text-success">
                  -${calculateDiscount(100)?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-border p-6">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-micro"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!couponData?.name || !couponData?.code || couponData?.locations?.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
            >
              Create Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCouponModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSave: PropTypes?.func?.isRequired
};

export default EventCouponModal;