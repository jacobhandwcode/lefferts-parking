'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const VipPermitModal = ({ isOpen, onClose, onSave, permit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    department: '',
    email: '',
    phone: '',
    accessLevel: 'vip',
    licensePlates: [''],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (permit) {
      setFormData({
        name: permit?.name || '',
        title: permit?.title || '',
        company: permit?.company || '',
        department: permit?.department || '',
        email: permit?.email || '',
        phone: permit?.phone || '',
        accessLevel: permit?.accessLevel || 'vip',
        licensePlates: permit?.licensePlates || [''],
        notes: permit?.notes || ''
      });
    } else {
      setFormData({
        name: '',
        title: '',
        company: '',
        department: '',
        email: '',
        phone: '',
        accessLevel: 'vip',
        licensePlates: [''],
        notes: ''
      });
    }
    setErrors({});
  }, [permit, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLicensePlateChange = (index, value) => {
    const newPlates = [...formData?.licensePlates];
    newPlates[index] = value?.toUpperCase();
    setFormData(prev => ({
      ...prev,
      licensePlates: newPlates
    }));
  };

  const addLicensePlate = () => {
    setFormData(prev => ({
      ...prev,
      licensePlates: [...prev?.licensePlates, '']
    }));
  };

  const removeLicensePlate = (index) => {
    if (formData?.licensePlates?.length > 1) {
      const newPlates = formData?.licensePlates?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        licensePlates: newPlates
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.company?.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    }

    const validPlates = formData?.licensePlates?.filter(plate => plate?.trim());
    if (validPlates?.length === 0) {
      newErrors.licensePlates = 'At least one license plate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const validPlates = formData?.licensePlates?.filter(plate => plate?.trim());
      const permitData = {
        ...formData,
        licensePlates: validPlates,
        phone: formData?.phone?.replace(/\D/g, '')?.replace(/(\d{3})(\d{3})(\d{4})/, '+1 $1 $2-$3')
      };
      
      onSave(permitData);
      onClose();
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value?.replace(/\D/g, '');
    if (numbers?.length <= 3) return numbers;
    if (numbers?.length <= 6) return `${numbers?.slice(0, 3)} ${numbers?.slice(3)}`;
    return `+1 ${numbers?.slice(0, 3)} ${numbers?.slice(3, 6)}-${numbers?.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e?.target?.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {permit ? 'Edit VIP Permit' : 'Add New VIP Permit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.name ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter full name"
                />
                {errors?.name && (
                  <p className="text-error text-sm mt-1">{errors?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData?.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.email ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter email address"
                />
                {errors?.email && (
                  <p className="text-error text-sm mt-1">{errors?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData?.phone}
                  onChange={handlePhoneChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.phone ? 'border-error' : 'border-border'
                  }`}
                  placeholder="+1 XXX XXX-XXXX"
                  maxLength={17}
                />
                {errors?.phone && (
                  <p className="text-error text-sm mt-1">{errors?.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData?.company}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors?.company ? 'border-error' : 'border-border'
                  }`}
                  placeholder="Enter company name"
                />
                {errors?.company && (
                  <p className="text-error text-sm mt-1">{errors?.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData?.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter department"
                />
              </div>
            </div>
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Access Level
            </label>
            <select
              name="accessLevel"
              value={formData?.accessLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="executive">Executive</option>
              <option value="vip">VIP</option>
              <option value="premium">Premium</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          {/* License Plates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">License Plates</h3>
              <button
                type="button"
                onClick={addLicensePlate}
                className="flex items-center space-x-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-micro"
              >
                <Icon name="PlusIcon" size={16} />
                <span>Add Plate</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData?.licensePlates?.map((plate, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => handleLicensePlateChange(index, e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                    placeholder="XXX XXX"
                    maxLength={7}
                  />
                  {formData?.licensePlates?.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLicensePlate(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-micro"
                    >
                      <Icon name="TrashIcon" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors?.licensePlates && (
              <p className="text-error text-sm">{errors?.licensePlates}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData?.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Additional notes or special instructions..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-micro"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro flex items-center space-x-2"
            >
              <Icon name="CheckIcon" size={16} />
              <span>{permit ? 'Update Permit' : 'Create Permit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

VipPermitModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSave: PropTypes?.func?.isRequired,
  permit: PropTypes?.shape({
    id: PropTypes?.number,
    name: PropTypes?.string,
    title: PropTypes?.string,
    company: PropTypes?.string,
    department: PropTypes?.string,
    email: PropTypes?.string,
    phone: PropTypes?.string,
    accessLevel: PropTypes?.string,
    licensePlates: PropTypes?.arrayOf(PropTypes?.string),
    notes: PropTypes?.string
  })
};

export default VipPermitModal;