'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import TowingStatusBadge from './TowingStatusBadge';

const UpdateStatusModal = ({ isOpen, onClose, towingRecord, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(towingRecord?.status || 'pending');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Towing request submitted, awaiting dispatch' },
    { value: 'dispatched', label: 'Dispatched', description: 'Tow truck has been dispatched to location' },
    { value: 'in-progress', label: 'In Progress', description: 'Tow truck is on scene, vehicle being processed' },
    { value: 'completed', label: 'Completed', description: 'Vehicle has been successfully towed and impounded' },
    { value: 'cancelled', label: 'Cancelled', description: 'Towing request has been cancelled' }
  ];

  if (!isOpen || !towingRecord) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdateStatus({
        recordId: towingRecord?.id,
        newStatus: selectedStatus,
        notes: notes?.trim(),
        timestamp: new Date()?.toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus(towingRecord?.status);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Update Towing Status</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {towingRecord?.towingId} • {towingRecord?.licensePlate}
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Current Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Current Status
            </label>
            <TowingStatusBadge status={towingRecord?.status} />
          </div>

          {/* New Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Update to Status
            </label>
            <div className="space-y-3">
              {statusOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-micro ${
                    selectedStatus === option?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option?.value}
                    checked={selectedStatus === option?.value}
                    onChange={(e) => setSelectedStatus(e?.target?.value)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground">{option?.label}</span>
                      <TowingStatusBadge status={option?.value} />
                    </div>
                    <p className="text-sm text-muted-foreground">{option?.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Status Update Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              placeholder="Add any relevant notes about this status update..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedStatus === towingRecord?.status}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-micro"
            >
              {isSubmitting && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              <span>{isSubmitting ? 'Updating...' : 'Update Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateStatusModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  towingRecord: PropTypes?.shape({
    id: PropTypes?.string,
    towingId: PropTypes?.string,
    licensePlate: PropTypes?.string,
    status: PropTypes?.string
  }),
  onUpdateStatus: PropTypes?.func?.isRequired
};

export default UpdateStatusModal;