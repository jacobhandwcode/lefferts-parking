'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import TowingFilters from './TowingFilters';
import TowingTable from './TowingTable';
import TowingDetailsModal from './TowingDetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import NewTowingRequestModal from './NewTowingRequestModal';

const TowingInteractive = ({ initialData }) => {
  const [towingRecords, setTowingRecords] = useState(initialData?.towingRecords || []);
  const [filteredRecords, setFilteredRecords] = useState(towingRecords);
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
    towCompany: 'all',
    dateRange: 'today'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, towingRecords]);

  const applyFilters = () => {
    let filtered = [...towingRecords];

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(record => record?.status === filters?.status);
    }

    // Apply location filter
    if (filters?.location !== 'all') {
      filtered = filtered?.filter(record => record?.location === filters?.location);
    }

    // Apply tow company filter
    if (filters?.towCompany !== 'all') {
      filtered = filtered?.filter(record => record?.towCompany === filters?.towCompany);
    }

    // Apply search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(record =>
        record?.licensePlate?.toLowerCase()?.includes(query) ||
        record?.towingId?.toLowerCase()?.includes(query)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleStatusUpdate = async (updateData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTowingRecords(prev => prev?.map(record => {
        if (record?.id === updateData?.recordId) {
          return {
            ...record,
            status: updateData?.newStatus,
            timeline: [
              ...record?.timeline,
              {
                action: `Status updated to ${updateData?.newStatus}`,
                timestamp: updateData?.timestamp,
                notes: updateData?.notes
              }
            ]
          };
        }
        return record;
      }));

      setShowUpdateModal(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleNewRequest = async (requestData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRecord = {
        id: `tow-${Date.now()}`,
        towingId: `TOW-${new Date()?.getFullYear()}-${String(Math.floor(Math.random() * 10000))?.padStart(6, '0')}`,
        licensePlate: requestData?.licensePlate,
        location: requestData?.location,
        towCompany: requestData?.towCompany,
        requestTime: requestData?.requestTime,
        status: requestData?.status,
        cost: 0,
        vehicleInfo: requestData?.vehicleInfo || 'Unknown',
        vehicleColor: requestData?.vehicleColor || 'Unknown',
        vinLast4: requestData?.vinLast4 || 'N/A',
        violationType: requestData?.violationType,
        officerBadge: requestData?.officerBadge,
        violationNotes: requestData?.violationNotes,
        towingFee: 150.00,
        storageFee: 0.00,
        adminFee: 25.00,
        timeline: [
          {
            action: 'Towing request submitted',
            timestamp: requestData?.requestTime,
            notes: requestData?.violationNotes
          }
        ]
      };

      newRecord.cost = newRecord?.towingFee + newRecord?.storageFee + newRecord?.adminFee;

      setTowingRecords(prev => [newRecord, ...prev]);
      setShowNewRequestModal(false);
    } catch (error) {
      console.error('Failed to submit towing request:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Towing ID',
      'License Plate',
      'Location',
      'Tow Company',
      'Request Time',
      'Status',
      'Cost',
      'Violation Type',
      'Officer Badge'
    ];

    const csvContent = [
      headers?.join(','),
      ...filteredRecords?.map(record => [
        record?.towingId,
        record?.licensePlate,
        record?.location,
        record?.towCompany,
        record?.requestTime,
        record?.status,
        record?.cost,
        record?.violationType,
        record?.officerBadge
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `towing-records-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Towing Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and coordinate vehicle towing operations across all locations
          </p>
        </div>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-micro"
        >
          <Icon name="PlusIcon" size={16} />
          <span>New Towing Request</span>
        </button>
      </div>

      {/* Filters */}
      <TowingFilters
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Table */}
      <TowingTable
        towingRecords={filteredRecords}
        onUpdateStatus={handleUpdateStatus}
        onViewDetails={handleViewDetails}
        onExportCSV={handleExportCSV}
      />

      {/* Modals */}
      <TowingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRecord(null);
        }}
        towingRecord={selectedRecord}
      />

      <UpdateStatusModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedRecord(null);
        }}
        towingRecord={selectedRecord}
        onUpdateStatus={handleStatusUpdate}
      />

      <NewTowingRequestModal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        onSubmitRequest={handleNewRequest}
      />
    </div>
  );
};

TowingInteractive.propTypes = {
  initialData: PropTypes?.shape({
    towingRecords: PropTypes?.arrayOf(PropTypes?.shape({
      id: PropTypes?.string?.isRequired,
      towingId: PropTypes?.string?.isRequired,
      licensePlate: PropTypes?.string?.isRequired,
      location: PropTypes?.string?.isRequired,
      towCompany: PropTypes?.string?.isRequired,
      requestTime: PropTypes?.string?.isRequired,
      status: PropTypes?.string?.isRequired,
      cost: PropTypes?.number?.isRequired
    }))
  })?.isRequired
};

export default TowingInteractive;