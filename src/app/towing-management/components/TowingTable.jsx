'use client';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import TowingStatusBadge from './TowingStatusBadge';

const TowingTable = ({ towingRecords, onUpdateStatus, onViewDetails, onExportCSV }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'requestTime', direction: 'desc' });
  const [selectedRecords, setSelectedRecords] = useState([]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = React.useMemo(() => {
    const sortableRecords = [...towingRecords];
    if (sortConfig?.key) {
      sortableRecords?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [towingRecords, sortConfig]);

  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => 
      prev?.includes(recordId) 
        ? prev?.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords?.length === towingRecords?.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(towingRecords?.map(record => record?.id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime)?.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ChevronUpDownIcon" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ChevronUpIcon" size={16} className="text-primary" />
      : <Icon name="ChevronDownIcon" size={16} className="text-primary" />;
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Table Header Actions */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Towing Records ({towingRecords?.length})
          </h3>
          {selectedRecords?.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedRecords?.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-surface hover:bg-muted border border-border rounded-lg transition-micro"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRecords?.length === towingRecords?.length && towingRecords?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border focus:ring-primary"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('towingId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Towing ID</span>
                  {getSortIcon('towingId')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('licensePlate')}
              >
                <div className="flex items-center space-x-1">
                  <span>License Plate</span>
                  {getSortIcon('licensePlate')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('towCompany')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tow Company</span>
                  {getSortIcon('towCompany')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('requestTime')}
              >
                <div className="flex items-center space-x-1">
                  <span>Request Time</span>
                  {getSortIcon('requestTime')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer hover:bg-muted"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center space-x-1">
                  <span>Cost</span>
                  {getSortIcon('cost')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedRecords?.map((record) => (
              <tr key={record?.id} className="hover:bg-surface transition-micro">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRecords?.includes(record?.id)}
                    onChange={() => handleSelectRecord(record?.id)}
                    className="rounded border-border focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-primary">
                    {record?.towingId}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {record?.licensePlate}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{record?.location}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="TruckIcon" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{record?.towCompany}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">
                    {formatDateTime(record?.requestTime)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <TowingStatusBadge status={record?.status} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(record?.cost)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails(record)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-micro"
                      title="View Details"
                    >
                      <Icon name="EyeIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(record)}
                      className="p-1.5 text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-micro"
                      title="Update Status"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {towingRecords?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="TruckIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Towing Records</h3>
          <p className="text-muted-foreground">No towing operations match your current filters.</p>
        </div>
      )}
    </div>
  );
};

TowingTable.propTypes = {
  towingRecords: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    towingId: PropTypes?.string?.isRequired,
    licensePlate: PropTypes?.string?.isRequired,
    location: PropTypes?.string?.isRequired,
    towCompany: PropTypes?.string?.isRequired,
    requestTime: PropTypes?.string?.isRequired,
    status: PropTypes?.string?.isRequired,
    cost: PropTypes?.number?.isRequired
  }))?.isRequired,
  onUpdateStatus: PropTypes?.func?.isRequired,
  onViewDetails: PropTypes?.func?.isRequired,
  onExportCSV: PropTypes?.func?.isRequired
};

export default TowingTable;