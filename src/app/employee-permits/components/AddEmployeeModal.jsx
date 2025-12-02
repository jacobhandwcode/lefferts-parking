'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const AddEmployeeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    email: '',
    phone: '',
    vehicles: [{ licensePlate: '', make: '', model: '', year: '', color: '' }]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Administration',
    'Security',
    'Maintenance',
    'Customer Service',
    'Finance',
    'Operations',
    'Management'
  ];

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

  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...formData?.vehicles];
    updatedVehicles[index] = {
      ...updatedVehicles?.[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      vehicles: updatedVehicles
    }));

    // Clear vehicle-specific errors
    const errorKey = `vehicle_${index}_${field}`;
    if (errors?.[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev?.vehicles, { licensePlate: '', make: '', model: '', year: '', color: '' }]
    }));
  };

  const removeVehicle = (index) => {
    if (formData?.vehicles?.length > 1) {
      const updatedVehicles = formData?.vehicles?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        vehicles: updatedVehicles
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Employee validation
    if (!formData?.employeeName?.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    if (!formData?.employeeId?.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Vehicle validation
    formData?.vehicles?.forEach((vehicle, index) => {
      if (!vehicle?.licensePlate?.trim()) {
        newErrors[`vehicle_${index}_licensePlate`] = 'License plate is required';
      } else if (!/^[A-Z0-9]{3}\s[A-Z0-9]{3}$/?.test(vehicle?.licensePlate?.toUpperCase())) {
        newErrors[`vehicle_${index}_licensePlate`] = 'Format: XXX XXX';
      }
      if (!vehicle?.make?.trim()) {
        newErrors[`vehicle_${index}_make`] = 'Make is required';
      }
      if (!vehicle?.model?.trim()) {
        newErrors[`vehicle_${index}_model`] = 'Model is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format license plates
      const formattedData = {
        ...formData,
        vehicles: formData?.vehicles?.map(vehicle => ({
          ...vehicle,
          licensePlate: vehicle?.licensePlate?.toUpperCase()?.replace(/\s+/g, ' ')
        }))
      };
      
      await onSave(formattedData);
      handleClose();
    } catch (error) {
      console.error('Error saving employee permit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      employeeName: '',
      employeeId: '',
      department: '',
      email: '',
      phone: '',
      vehicles: [{ licensePlate: '', make: '', model: '', year: '', color: '' }]
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add Employee Permit</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Employee Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData?.employeeName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.employeeName ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors?.employeeName && (
                    <p className="text-error text-sm mt-1">{errors?.employeeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData?.employeeId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.employeeId ? 'border-error' : 'border-border'
                    }`}
                    placeholder="EMP-12345"
                  />
                  {errors?.employeeId && (
                    <p className="text-error text-sm mt-1">{errors?.employeeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData?.department}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.department ? 'border-error' : 'border-border'
                    }`}
                  >
                    <option value="">Select department</option>
                    {departments?.map((dept) => (
                      <option key={dept} value={dept?.toLowerCase()?.replace(' ', '_')}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors?.department && (
                    <p className="text-error text-sm mt-1">{errors?.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors?.email ? 'border-error' : 'border-border'
                    }`}
                    placeholder="employee@company.com"
                  />
                  {errors?.email && (
                    <p className="text-error text-sm mt-1">{errors?.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1 555 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Vehicle Information</h3>
                <button
                  type="button"
                  onClick={addVehicle}
                  className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
                >
                  <Icon name="PlusIcon" size={16} />
                  <span>Add Vehicle</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData?.vehicles?.map((vehicle, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Vehicle {index + 1}</h4>
                      {formData?.vehicles?.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVehicle(index)}
                          className="p-1 text-error hover:bg-error/5 rounded transition-micro"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          License Plate *
                        </label>
                        <input
                          type="text"
                          value={vehicle?.licensePlate}
                          onChange={(e) => handleVehicleChange(index, 'licensePlate', e?.target?.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono ${
                            errors?.[`vehicle_${index}_licensePlate`] ? 'border-error' : 'border-border'
                          }`}
                          placeholder="ABC 123"
                        />
                        {errors?.[`vehicle_${index}_licensePlate`] && (
                          <p className="text-error text-sm mt-1">{errors?.[`vehicle_${index}_licensePlate`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Make *
                        </label>
                        <input
                          type="text"
                          value={vehicle?.make}
                          onChange={(e) => handleVehicleChange(index, 'make', e?.target?.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors?.[`vehicle_${index}_make`] ? 'border-error' : 'border-border'
                          }`}
                          placeholder="Toyota"
                        />
                        {errors?.[`vehicle_${index}_make`] && (
                          <p className="text-error text-sm mt-1">{errors?.[`vehicle_${index}_make`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Model *
                        </label>
                        <input
                          type="text"
                          value={vehicle?.model}
                          onChange={(e) => handleVehicleChange(index, 'model', e?.target?.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors?.[`vehicle_${index}_model`] ? 'border-error' : 'border-border'
                          }`}
                          placeholder="Camry"
                        />
                        {errors?.[`vehicle_${index}_model`] && (
                          <p className="text-error text-sm mt-1">{errors?.[`vehicle_${index}_model`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={vehicle?.year}
                          onChange={(e) => handleVehicleChange(index, 'year', e?.target?.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="2023"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          value={vehicle?.color}
                          onChange={(e) => handleVehicleChange(index, 'color', e?.target?.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Silver"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-surface">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              <span>{isSubmitting ? 'Saving...' : 'Save Employee Permit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddEmployeeModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  onSave: PropTypes?.func?.isRequired
};

export default AddEmployeeModal;