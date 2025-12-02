'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const NewTowingRequestModal = ({ isOpen, onClose, onSubmitRequest }) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    location: '',
    towCompany: '',
    violationType: '',
    vehicleInfo: '',
    vehicleColor: '',
    vinLast4: '',
    officerBadge: '',
    violationNotes: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const locationOptions = [
    { value: '', label: 'Select Location' },
    { value: 'pacs', label: 'Pacs' },
    { value: '11-st', label: '11 ST' },
    { value: '54-flagler', label: '54 Flagler' },
    { value: '18-lincoln', label: '18 Lincoln' },
    { value: '72-park', label: '72 Park' }
  ];

  const towCompanyOptions = [
    { value: '', label: 'Select Tow Company' },
    { value: 'metro-towing', label: 'Metro Towing' },
    { value: 'city-tow', label: 'City Tow Services' },
    { value: 'rapid-recovery', label: 'Rapid Recovery' },
    { value: 'downtown-towing', label: 'Downtown Towing' }
  ];

  const violationTypeOptions = [
    { value: '', label: 'Select Violation Type' },
    { value: 'expired-meter', label: 'Expired Meter' },
    { value: 'no-permit', label: 'No Valid Permit' },
    { value: 'fire-lane', label: 'Fire Lane Violation' },
    { value: 'handicap', label: 'Handicap Violation' },
    { value: 'blocking-traffic', label: 'Blocking Traffic' },
    { value: 'abandoned', label: 'Abandoned Vehicle' },
    { value: 'other', label: 'Other Violation' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Standard processing time' },
    { value: 'normal', label: 'Normal Priority', description: 'Regular towing request' },
    { value: 'high', label: 'High Priority', description: 'Urgent - blocking traffic' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate response required' }
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.licensePlate?.trim()) {
      newErrors.licensePlate = 'License plate is required';
    } else if (!/^[A-Z0-9\s]{2,10}$/i?.test(formData?.licensePlate?.trim())) {
      newErrors.licensePlate = 'Invalid license plate format';
    }

    if (!formData?.location) {
      newErrors.location = 'Location is required';
    }

    if (!formData?.towCompany) {
      newErrors.towCompany = 'Tow company is required';
    }

    if (!formData?.violationType) {
      newErrors.violationType = 'Violation type is required';
    }

    if (!formData?.officerBadge?.trim()) {
      newErrors.officerBadge = 'Officer badge number is required';
    }

    if (!formData?.violationNotes?.trim()) {
      newErrors.violationNotes = 'Violation notes are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        licensePlate: formData?.licensePlate?.toUpperCase()?.trim(),
        requestTime: new Date()?.toISOString(),
        status: 'pending'
      };

      await onSubmitRequest(requestData);
      handleClose();
    } catch (error) {
      console.error('Failed to submit towing request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      licensePlate: '',
      location: '',
      towCompany: '',
      violationType: '',
      vehicleInfo: '',
      vehicleColor: '',
      vinLast4: '',
      officerBadge: '',
      violationNotes: '',
      priority: 'normal'
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">New Towing Request</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a new vehicle towing request
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData?.licensePlate}
                  onChange={handleInputChange}
                  placeholder="ABC 123"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono uppercase ${
                    errors?.licensePlate ? 'border-error' : 'border-border'
                  }`}
                />
                {errors?.licensePlate && (
                  <p className="text-sm text-error mt-1">{errors?.licensePlate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Make/Model
                </label>
                <input
                  type="text"
                  name="vehicleInfo"
                  value={formData?.vehicleInfo}
                  onChange={handleInputChange}
                  placeholder="Honda Civic"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData?.vehicleColor}
                  onChange={handleInputChange}
                  placeholder="Blue"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  VIN (Last 4 digits)
                </label>
                <input
                  type="text"
                  name="vinLast4"
                  value={formData?.vinLast4}
                  onChange={handleInputChange}
                  placeholder="1234"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                />
              </div>
            </div>
          </div>

          {/* Location and Company */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Towing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData?.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.location ? 'border-error' : 'border-border'
                  }`}
                >
                  {locationOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                {errors?.location && (
                  <p className="text-sm text-error mt-1">{errors?.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tow Company *
                </label>
                <select
                  name="towCompany"
                  value={formData?.towCompany}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.towCompany ? 'border-error' : 'border-border'
                  }`}
                >
                  {towCompanyOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                {errors?.towCompany && (
                  <p className="text-sm text-error mt-1">{errors?.towCompany}</p>
                )}
              </div>
            </div>
          </div>

          {/* Violation Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Violation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Violation Type *
                </label>
                <select
                  name="violationType"
                  value={formData?.violationType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.violationType ? 'border-error' : 'border-border'
                  }`}
                >
                  {violationTypeOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
                {errors?.violationType && (
                  <p className="text-sm text-error mt-1">{errors?.violationType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Officer Badge Number *
                </label>
                <input
                  type="text"
                  name="officerBadge"
                  value={formData?.officerBadge}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono ${
                    errors?.officerBadge ? 'border-error' : 'border-border'
                  }`}
                />
                {errors?.officerBadge && (
                  <p className="text-sm text-error mt-1">{errors?.officerBadge}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Violation Notes *
              </label>
              <textarea
                name="violationNotes"
                value={formData?.violationNotes}
                onChange={handleInputChange}
                placeholder="Describe the violation and circumstances..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors?.violationNotes ? 'border-error' : 'border-border'
                }`}
              />
              {errors?.violationNotes && (
                <p className="text-sm text-error mt-1">{errors?.violationNotes}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Priority Level
            </label>
            <div className="space-y-2">
              {priorityOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-micro ${
                    formData?.priority === option?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option?.value}
                    checked={formData?.priority === option?.value}
                    onChange={handleInputChange}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-medium text-foreground">{option?.label}</div>
                    <div className="text-sm text-muted-foreground">{option?.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-micro"
            >
              {isSubmitting && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

NewTowingRequestModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSubmitRequest: PropTypes?.func?.isRequired
};

export default NewTowingRequestModal;