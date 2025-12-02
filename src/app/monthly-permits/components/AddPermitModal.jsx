'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import VehicleCounter from './VehicleCounter';

const AddPermitModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    holderName: '',
    holderId: '',
    email: '',
    phone: '',
    location: 'pacs',
    issueDate: new Date()?.toISOString()?.split('T')?.[0],
    expiryDate: '',
    vehicles: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const locationOptions = [
    { value: 'pacs', label: 'Pacs' },
    { value: '11_st', label: '11 ST' },
    { value: '54_flagler', label: '54 Flagler' },
    { value: '18_lincoln', label: '18 Lincoln' },
    { value: '72_park', label: '72 Park' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.holderName?.trim()) {
      newErrors.holderName = 'Permit holder name is required';
    }

    if (!formData?.holderId?.trim()) {
      newErrors.holderId = 'Holder ID is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData?.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
      newErrors.expiryDate = 'Expiry date must be after issue date';
    }

    if (!formData?.vehicles?.length || !formData?.vehicles?.[0]?.licensePlate?.trim()) {
      newErrors.vehicles = 'At least one vehicle with license plate is required';
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

  const formatPhoneNumber = (value) => {
    const cleaned = value?.replace(/\D/g, '');
    if (cleaned?.length <= 10) {
      const match = cleaned?.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return !match?.[2] ? match?.[1] : `${match?.[1]} ${match?.[2]}${match?.[3] ? `-${match?.[3]}` : ''}`;
      }
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e?.target?.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  const handleVehiclesChange = (vehicles) => {
    setFormData(prev => ({
      ...prev,
      vehicles
    }));
    
    if (errors?.vehicles) {
      setErrors(prev => ({
        ...prev,
        vehicles: ''
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
      // Generate permit ID
      const permitId = `MP-${Date.now()?.toString()?.slice(-6)}`;
      
      const permitData = {
        ...formData,
        permitId,
        status: 'active',
        phone: `+1 ${formData?.phone?.replace(/\D/g, '')}`
      };

      await onSave(permitData);
      
      // Reset form
      setFormData({
        holderName: '',
        holderId: '',
        email: '',
        phone: '',
        location: 'pacs',
        issueDate: new Date()?.toISOString()?.split('T')?.[0],
        expiryDate: '',
        vehicles: []
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error saving permit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add New Monthly Permit</h2>
            <p className="text-sm text-muted-foreground">Create a new monthly parking permit</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Permit Holder Information */}
            <div className="bg-surface/50 border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Permit Holder Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="holderName"
                    value={formData?.holderName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.holderName ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors?.holderName && (
                    <p className="text-xs text-error mt-1">{errors?.holderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Holder ID *
                  </label>
                  <input
                    type="text"
                    name="holderId"
                    value={formData?.holderId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.holderId ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter holder ID"
                  />
                  {errors?.holderId && (
                    <p className="text-xs text-error mt-1">{errors?.holderId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.email ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors?.email && (
                    <p className="text-xs text-error mt-1">{errors?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData?.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.phone ? 'border-error' : 'border-border'
                    }`}
                    placeholder="XXX XXX-XXXX"
                    maxLength={12}
                  />
                  {errors?.phone && (
                    <p className="text-xs text-error mt-1">{errors?.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Permit Details */}
            <div className="bg-surface/50 border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Permit Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData?.location}
                      onChange={handleInputChange}
                      className="w-full appearance-none px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {locationOptions?.map(option => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </select>
                    <Icon 
                      name="ChevronDownIcon" 
                      size={16} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData?.issueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData?.expiryDate}
                    onChange={handleInputChange}
                    min={formData?.issueDate}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.expiryDate ? 'border-error' : 'border-border'
                    }`}
                  />
                  {errors?.expiryDate && (
                    <p className="text-xs text-error mt-1">{errors?.expiryDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <VehicleCounter 
                onVehiclesChange={handleVehiclesChange}
                initialVehicles={formData?.vehicles}
              />
              {errors?.vehicles && (
                <p className="text-xs text-error mt-2">{errors?.vehicles}</p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-micro"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            {isSubmitting ? 'Creating...' : 'Create Permit'}
          </button>
        </div>
      </div>
    </div>
  );
};

AddPermitModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSave: PropTypes?.func?.isRequired
};

export default AddPermitModal;