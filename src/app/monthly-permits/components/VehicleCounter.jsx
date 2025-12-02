'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const VehicleCounter = ({ onVehiclesChange, initialVehicles = [] }) => {
  const [vehicles, setVehicles] = useState(initialVehicles?.length > 0 ? initialVehicles : [{ licensePlate: '', make: '', model: '', color: '' }]);

  const addVehicle = () => {
    const newVehicles = [...vehicles, { licensePlate: '', make: '', model: '', color: '' }];
    setVehicles(newVehicles);
    onVehiclesChange(newVehicles);
  };

  const removeVehicle = (index) => {
    if (vehicles?.length > 1) {
      const newVehicles = vehicles?.filter((_, i) => i !== index);
      setVehicles(newVehicles);
      onVehiclesChange(newVehicles);
    }
  };

  const updateVehicle = (index, field, value) => {
    const newVehicles = vehicles?.map((vehicle, i) => 
      i === index ? { ...vehicle, [field]: value } : vehicle
    );
    setVehicles(newVehicles);
    onVehiclesChange(newVehicles);
  };

  const formatLicensePlate = (value) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value?.replace(/[^A-Z0-9]/gi, '')?.toUpperCase();
    
    // Apply XXX XXX format
    if (cleaned?.length <= 3) {
      return cleaned;
    } else if (cleaned?.length <= 6) {
      return `${cleaned?.slice(0, 3)} ${cleaned?.slice(3)}`;
    } else {
      return `${cleaned?.slice(0, 3)} ${cleaned?.slice(3, 6)}`;
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Vehicle Information</h3>
          <p className="text-xs text-muted-foreground">Add up to 5 vehicles per permit</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {vehicles?.length} of 5 vehicles
          </span>
          <button
            onClick={addVehicle}
            disabled={vehicles?.length >= 5}
            className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            <Icon name="PlusIcon" size={14} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {vehicles?.map((vehicle, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-surface/50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">
                Vehicle {index + 1}
              </h4>
              {vehicles?.length > 1 && (
                <button
                  onClick={() => removeVehicle(index)}
                  className="p-1 text-error hover:bg-error/10 rounded-lg transition-micro"
                >
                  <Icon name="TrashIcon" size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  License Plate *
                </label>
                <input
                  type="text"
                  value={vehicle?.licensePlate}
                  onChange={(e) => updateVehicle(index, 'licensePlate', formatLicensePlate(e?.target?.value))}
                  placeholder="ABC 123"
                  maxLength={7}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={vehicle?.make}
                  onChange={(e) => updateVehicle(index, 'make', e?.target?.value)}
                  placeholder="Toyota"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={vehicle?.model}
                  onChange={(e) => updateVehicle(index, 'model', e?.target?.value)}
                  placeholder="Camry"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={vehicle?.color}
                  onChange={(e) => updateVehicle(index, 'color', e?.target?.value)}
                  placeholder="Silver"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

VehicleCounter.propTypes = {
  onVehiclesChange: PropTypes?.func?.isRequired,
  initialVehicles: PropTypes?.arrayOf(PropTypes?.shape({
    licensePlate: PropTypes?.string,
    make: PropTypes?.string,
    model: PropTypes?.string,
    color: PropTypes?.string
  }))
};

export default VehicleCounter;