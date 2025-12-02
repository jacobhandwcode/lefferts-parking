'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const MaintenanceForm = ({ onSubmit, locations, operators }) => {
  const [formData, setFormData] = useState({
    date: new Date()?.toISOString()?.split('T')?.[0],
    lot: '',
    status: 'Open',
    description: '',
    openBy: '',
    priority: 'Medium',
    category: 'Maintenance',
    estimatedTime: '1 hour'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'Open', label: 'Open', color: 'text-red-600 bg-red-50' },
    { value: 'In Progress', label: 'In Progress', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'Closed', label: 'Closed', color: 'text-green-600 bg-green-50' }
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const categoryOptions = [
    { value: 'Maintenance', label: 'General Maintenance' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Lighting', label: 'Lighting' },
    { value: 'Security', label: 'Security' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Cleaning', label: 'Cleaning' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData?.date || !formData?.lot || !formData?.description || !formData?.openBy) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Find operator name from operators list
      const selectedOperator = operators?.find(op => op?.id === formData?.openBy);
      
      await onSubmit({
        ...formData,
        openBy: selectedOperator?.name || formData?.openBy,
        assignedTo: selectedOperator?.name || 'Unassigned'
      });

      // Reset form
      setFormData({
        date: new Date()?.toISOString()?.split('T')?.[0],
        lot: '',
        status: 'Open',
        description: '',
        openBy: '',
        priority: 'Medium',
        category: 'Maintenance',
        estimatedTime: '1 hour'
      });

    } catch (error) {
      console.error('Error creating maintenance record:', error);
      alert('Error creating maintenance record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="WrenchScrewdriverIcon" size={20} className="text-primary" />
        <h2 className="text-lg font-medium text-foreground">New Maintenance Request</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Lot Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Lot <span className="text-red-500">*</span>
            </label>
            <select
              value={formData?.lot}
              onChange={(e) => handleInputChange('lot', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select lot...</option>
              {locations?.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData?.status}
              onChange={(e) => handleInputChange('status', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions?.map(status => (
                <option key={status?.value} value={status?.value}>{status?.label}</option>
              ))}
            </select>
          </div>

          {/* Open By Dropdown */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Open By <span className="text-red-500">*</span>
            </label>
            <select
              value={formData?.openBy}
              onChange={(e) => handleInputChange('openBy', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select operator...</option>
              {operators?.map(operator => (
                <option key={operator?.id} value={operator?.id}>
                  {operator?.name} ({operator?.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <select
              value={formData?.priority}
              onChange={(e) => handleInputChange('priority', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {priorityOptions?.map(priority => (
                <option key={priority?.value} value={priority?.value}>{priority?.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={formData?.category}
              onChange={(e) => handleInputChange('category', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categoryOptions?.map(category => (
                <option key={category?.value} value={category?.value}>{category?.label}</option>
              ))}
            </select>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Estimated Time
            </label>
            <select
              value={formData?.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="4 hours">4 hours</option>
              <option value="8 hours">8 hours</option>
              <option value="1 day">1 day</option>
              <option value="2 days">2 days</option>
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Describe the maintenance issue or task in detail..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="CheckIcon" size={16} />
                <span>Save Maintenance Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

MaintenanceForm.propTypes = {
  onSubmit: PropTypes?.func?.isRequired,
  locations: PropTypes?.array?.isRequired,
  operators: PropTypes?.array?.isRequired
};

export default MaintenanceForm;