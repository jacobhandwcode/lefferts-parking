'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EmployeePermitStats from './EmployeePermitStats';
import EmployeePermitFilters from './EmployeePermitFilters';
import EmployeePermitTable from './EmployeePermitTable';
import AddEmployeeModal from './AddEmployeeModal';

const EmployeePermitsInteractive = ({ initialData }) => {
  const [permits, setPermits] = useState(initialData?.permits);
  const [filteredPermits, setFilteredPermits] = useState(initialData?.permits);
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [stats, setStats] = useState(initialData?.stats);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ department: 'all', status: 'all' });

  useEffect(() => {
    applyFilters();
  }, [permits, searchQuery, filters]);

  const applyFilters = () => {
    let filtered = [...permits];

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(permit =>
        permit?.employeeName?.toLowerCase()?.includes(query) ||
        permit?.employeeId?.toLowerCase()?.includes(query) ||
        permit?.licensePlate?.toLowerCase()?.includes(query) ||
        permit?.department?.toLowerCase()?.includes(query)
      );
    }

    // Apply department filter
    if (filters?.department !== 'all') {
      filtered = filtered?.filter(permit => permit?.department === filters?.department);
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(permit => permit?.status === filters?.status);
    }

    setFilteredPermits(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectPermit = (permitId) => {
    setSelectedPermits(prev => {
      if (prev?.includes(permitId)) {
        return prev?.filter(id => id !== permitId);
      } else {
        return [...prev, permitId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPermits?.length === filteredPermits?.length) {
      setSelectedPermits([]);
    } else {
      setSelectedPermits(filteredPermits?.map(permit => permit?.id));
    }
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    // Simulate API call
    const newPermit = {
      id: `emp_${Date.now()}`,
      employeeName: employeeData?.employeeName,
      employeeId: employeeData?.employeeId,
      employeePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      department: employeeData?.department,
      licensePlate: employeeData?.vehicles?.[0]?.licensePlate,
      vehicleCount: employeeData?.vehicles?.length,
      issueDate: new Date()?.toISOString()?.split('T')?.[0],
      status: 'active'
    };

    setPermits(prev => [newPermit, ...prev]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalPermits: prev?.totalPermits + 1,
      activePermits: prev?.activePermits + 1,
      totalVehicles: prev?.totalVehicles + employeeData?.vehicles?.length
    }));
  };

  const handleEditPermit = (permit) => {
    console.log('Edit permit:', permit);
    // Implementation for edit functionality
  };

  const handleDeactivatePermit = (permitId) => {
    setPermits(prev => prev?.map(permit => 
      permit?.id === permitId 
        ? { ...permit, status: 'inactive' }
        : permit
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      activePermits: prev?.activePermits - 1
    }));
  };

  const handleDeletePermit = (permitId) => {
    if (window.confirm('Are you sure you want to delete this employee permit?')) {
      const permitToDelete = permits?.find(p => p?.id === permitId);
      setPermits(prev => prev?.filter(permit => permit?.id !== permitId));
      setSelectedPermits(prev => prev?.filter(id => id !== permitId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPermits: prev?.totalPermits - 1,
        activePermits: permitToDelete?.status === 'active' ? prev?.activePermits - 1 : prev?.activePermits
      }));
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredPermits?.map(permit => ({
      'Employee Name': permit?.employeeName,
      'Employee ID': permit?.employeeId,
      'Department': permit?.department,
      'License Plate': permit?.licensePlate,
      'Issue Date': permit?.issueDate,
      'Status': permit?.status
    }));

    const csvContent = [
      Object.keys(csvData?.[0])?.join(','),
      ...csvData?.map(row => Object.values(row)?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-permits-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <EmployeePermitStats stats={stats} />
      
      <EmployeePermitFilters
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onAddEmployee={handleAddEmployee}
      />
      
      <EmployeePermitTable
        permits={filteredPermits}
        selectedPermits={selectedPermits}
        onSelectPermit={handleSelectPermit}
        onSelectAll={handleSelectAll}
        onEditPermit={handleEditPermit}
        onDeactivatePermit={handleDeactivatePermit}
        onDeletePermit={handleDeletePermit}
        onExportCSV={handleExportCSV}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

EmployeePermitsInteractive.propTypes = {
  initialData: PropTypes?.shape({
    permits: PropTypes?.array?.isRequired,
    stats: PropTypes?.object?.isRequired
  })?.isRequired
};

export default EmployeePermitsInteractive;