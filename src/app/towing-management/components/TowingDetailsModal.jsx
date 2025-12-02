'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import TowingStatusBadge from './TowingStatusBadge';

const TowingDetailsModal = ({ isOpen, onClose, towingRecord }) => {
  if (!isOpen || !towingRecord) return null;

  const formatDateTime = (dateTime) => {
    return new Date(dateTime)?.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
      <div className="bg-white rounded-lg shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Towing Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Reference: {towingRecord?.towingId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-micro"
          >
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  License Plate
                </label>
                <p className="font-mono text-lg font-semibold text-foreground">
                  {towingRecord?.licensePlate}
                </p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Vehicle Make/Model
                </label>
                <p className="text-foreground">{towingRecord?.vehicleInfo}</p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Color
                </label>
                <p className="text-foreground">{towingRecord?.vehicleColor}</p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  VIN (Last 4)
                </label>
                <p className="font-mono text-foreground">{towingRecord?.vinLast4}</p>
              </div>
            </div>
          </div>

          {/* Towing Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Towing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Location
                </label>
                <p className="text-foreground">{towingRecord?.location}</p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Tow Company
                </label>
                <div className="flex items-center space-x-2">
                  <Icon name="TruckIcon" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{towingRecord?.towCompany}</span>
                </div>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Request Time
                </label>
                <p className="text-foreground">{formatDateTime(towingRecord?.requestTime)}</p>
              </div>
              <div className="bg-surface p-4 rounded-lg">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Status
                </label>
                <TowingStatusBadge status={towingRecord?.status} />
              </div>
            </div>
          </div>

          {/* Violation Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Violation Information</h3>
            <div className="bg-surface p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Violation Type
                  </label>
                  <p className="text-foreground">{towingRecord?.violationType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Officer Badge
                  </label>
                  <p className="font-mono text-foreground">{towingRecord?.officerBadge}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Violation Notes
                </label>
                <p className="text-foreground">{towingRecord?.violationNotes}</p>
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Cost Breakdown</h3>
            <div className="bg-surface p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Towing Fee</span>
                  <span className="text-foreground">{formatCurrency(towingRecord?.towingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Fee</span>
                  <span className="text-foreground">{formatCurrency(towingRecord?.storageFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Administrative Fee</span>
                  <span className="text-foreground">{formatCurrency(towingRecord?.adminFee)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total Cost</span>
                  <span className="text-foreground">{formatCurrency(towingRecord?.cost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Timeline</h3>
            <div className="space-y-3">
              {towingRecord?.timeline?.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="CheckIcon" size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{event?.action}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(event?.timestamp)}</p>
                    {event?.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{event?.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-micro">
            Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

TowingDetailsModal.propTypes = {
  isOpen: PropTypes?.bool?.isRequired,
  onClose: PropTypes?.func?.isRequired,
  towingRecord: PropTypes?.shape({
    id: PropTypes?.string,
    towingId: PropTypes?.string,
    licensePlate: PropTypes?.string,
    location: PropTypes?.string,
    towCompany: PropTypes?.string,
    requestTime: PropTypes?.string,
    status: PropTypes?.string,
    cost: PropTypes?.number,
    vehicleInfo: PropTypes?.string,
    vehicleColor: PropTypes?.string,
    vinLast4: PropTypes?.string,
    violationType: PropTypes?.string,
    officerBadge: PropTypes?.string,
    violationNotes: PropTypes?.string,
    towingFee: PropTypes?.number,
    storageFee: PropTypes?.number,
    adminFee: PropTypes?.number,
    timeline: PropTypes?.arrayOf(PropTypes?.shape({
      action: PropTypes?.string,
      timestamp: PropTypes?.string,
      notes: PropTypes?.string
    }))
  })
};

export default TowingDetailsModal;