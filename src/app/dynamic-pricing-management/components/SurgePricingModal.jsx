'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const SurgePricingModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    occupancy: '50%',
    operator: '>',
    threshold: '',
    additionalType: 'percentage', // 'percentage' or 'amount'
    additionalPrice: ''
  });

  if (!isOpen) return null;

  const occupancyOptions = ['50%', '60%', '70%', '80%', '90%', '100%'];
  const operatorOptions = ['>', '<', '=', '>=', '<='];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleType = () => {
    setFormData(prev => ({
      ...prev,
      additionalType: prev?.additionalType === 'percentage' ? 'amount' : 'percentage'
    }));
  };

  const handleUpdate = () => {
    // Validate required fields
    if (!formData?.threshold || !formData?.additionalPrice) {
      alert('Please fill in all required fields');
      return;
    }

    const surgeData = {
      occupancy: formData?.occupancy,
      operator: formData?.operator,
      threshold: parseFloat(formData?.threshold),
      additionalType: formData?.additionalType,
      additionalPrice: parseFloat(formData?.additionalPrice),
      createdAt: new Date()?.toISOString()
    };

    onSave(surgeData);
    
    // Reset form
    setFormData({
      occupancy: '50%',
      operator: '>',
      threshold: '',
      additionalType: 'percentage',
      additionalPrice: ''
    });
  };

  const getPreviewText = () => {
    if (!formData?.threshold || !formData?.additionalPrice) return '';
    
    const typeText = formData?.additionalType === 'percentage' ? '%' : '$';
    return `When occupancy ${formData?.operator} ${formData?.threshold}%, add ${formData?.additionalPrice}${typeText} to base rate`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Surge Pricing Option</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-micro"
            >
              <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Occupancy Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Occupancy
            </label>
            <select
              value={formData?.occupancy}
              onChange={(e) => handleInputChange('occupancy', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {occupancyOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Operator Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Operator
            </label>
            <select
              value={formData?.operator}
              onChange={(e) => handleInputChange('operator', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {operatorOptions?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Enter Threshold */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Enter Threshold
            </label>
            <input
              type="number"
              value={formData?.threshold}
              onChange={(e) => handleInputChange('threshold', e?.target?.value)}
              placeholder="Enter threshold value"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Additional $/% Toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Type
            </label>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${formData?.additionalType === 'amount' ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                Percentage (%)
              </span>
              <button
                type="button"
                onClick={handleToggleType}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  formData?.additionalType === 'amount' ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData?.additionalType === 'amount' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${formData?.additionalType === 'percentage' ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                Dollar Amount ($)
              </span>
            </div>
          </div>

          {/* Additional Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {formData?.additionalType === 'percentage' ? '%' : '$'}
              </span>
              <input
                type="number"
                value={formData?.additionalPrice}
                onChange={(e) => handleInputChange('additionalPrice', e?.target?.value)}
                placeholder={formData?.additionalType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                min="0"
                step={formData?.additionalType === 'percentage' ? '1' : '0.01'}
                className="w-full pl-8 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {getPreviewText() && (
            <div className="p-3 bg-surface rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-1">Preview</h4>
              <p className="text-sm text-muted-foreground">{getPreviewText()}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-micro"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SurgePricingModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSave: PropTypes?.func?.isRequired
};

export default SurgePricingModal;