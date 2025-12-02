'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import VipPermitStats from './VipPermitStats';
import VipPermitFilters from './VipPermitFilters';
import VipPermitTable from './VipPermitTable';
import VipPermitModal from './VipPermitModal';
import BulkActionsBar from './BulkActionsBar';

const VipPermitsInteractive = ({ initialData }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permits, setPermits] = useState(initialData?.permits);
  const [filteredPermits, setFilteredPermits] = useState(initialData?.permits);
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    company: 'all',
    accessLevel: 'all'
  });

  useEffect(() => {
    let filtered = [...permits];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(permit =>
        permit?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        permit?.company?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        permit?.licensePlates?.some(plate => 
          plate?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(permit => permit?.status === filters?.status);
    }

    // Apply company filter
    if (filters?.company !== 'all') {
      filtered = filtered?.filter(permit => 
        permit?.company?.toLowerCase()?.replace(/\s+/g, '_') === filters?.company
      );
    }

    // Apply access level filter
    if (filters?.accessLevel !== 'all') {
      filtered = filtered?.filter(permit => permit?.accessLevel === filters?.accessLevel);
    }

    setFilteredPermits(filtered);
  }, [permits, searchQuery, filters]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    if (filter?.type === 'clear') {
      setFilters({
        status: 'all',
        company: 'all',
        accessLevel: 'all'
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filter?.type]: filter?.value
      }));
    }
  };

  const handleAddPermit = () => {
    setEditingPermit(null);
    setIsModalOpen(true);
  };

  const handleEditPermit = (permit) => {
    setEditingPermit(permit);
    setIsModalOpen(true);
  };

  const handleSavePermit = (permitData) => {
    if (editingPermit) {
      // Update existing permit
      setPermits(prev => prev?.map(permit => 
        permit?.id === editingPermit?.id 
          ? { ...permit, ...permitData, updatedAt: new Date()?.toISOString() }
          : permit
      ));
    } else {
      // Add new permit
      const newPermit = {
        id: Date.now(),
        ...permitData,
        status: 'active',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      setPermits(prev => [newPermit, ...prev]);
    }
  };

  const handleDeletePermit = (permitId) => {
    if (window.confirm('Are you sure you want to delete this VIP permit?')) {
      setPermits(prev => prev?.filter(permit => permit?.id !== permitId));
      setSelectedPermits(prev => prev?.filter(id => id !== permitId));
    }
  };

  const handleStatusChange = (permitId, newStatus) => {
    setPermits(prev => prev?.map(permit =>
      permit?.id === permitId
        ? { ...permit, status: newStatus, updatedAt: new Date()?.toISOString() }
        : permit
    ));
  };

  const handleSelectPermit = (permitId, isSelected) => {
    if (isSelected) {
      setSelectedPermits(prev => [...prev, permitId]);
    } else {
      setSelectedPermits(prev => prev?.filter(id => id !== permitId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedPermits(filteredPermits?.map(permit => permit?.id));
    } else {
      setSelectedPermits([]);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'activate':
        setPermits(prev => prev?.map(permit =>
          selectedPermits?.includes(permit?.id)
            ? { ...permit, status: 'active', updatedAt: new Date()?.toISOString() }
            : permit
        ));
        break;
      case 'suspend':
        setPermits(prev => prev?.map(permit =>
          selectedPermits?.includes(permit?.id)
            ? { ...permit, status: 'suspended', updatedAt: new Date()?.toISOString() }
            : permit
        ));
        break;
      case 'delete':
        setPermits(prev => prev?.filter(permit => !selectedPermits?.includes(permit?.id)));
        break;
      case 'export':
        handleExportCSV();
        break;
    }
    setSelectedPermits([]);
  };

  const handleExportCSV = () => {
    const selectedData = permits?.filter(permit => selectedPermits?.includes(permit?.id));
    const csvData = selectedData?.map(permit => ({
      Name: permit?.name,
      Title: permit?.title,
      Company: permit?.company,
      Department: permit?.department,
      Email: permit?.email,
      Phone: permit?.phone,
      'License Plates': permit?.licensePlates?.join(', '),
      'Access Level': permit?.accessLevel,
      Status: permit?.status,
      'Created Date': new Date(permit.createdAt)?.toLocaleDateString()
    }));

    const csvContent = [
      Object.keys(csvData?.[0])?.join(','),
      ...csvData?.map(row => Object.values(row)?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vip-permits-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const calculateStats = () => {
    const total = permits?.length;
    const active = permits?.filter(p => p?.status === 'active')?.length;
    const companies = new Set(permits.map(p => p.company))?.size;
    const vehicles = permits?.reduce((sum, p) => sum + p?.licensePlates?.length, 0);

    return { total, active, companies, vehicles };
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <main className={`transition-all duration-200 ${
        sidebarCollapsed ? 'ml-16' : 'ml-72'
      } pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">VIP Permits</h1>
              <p className="text-muted-foreground">
                Manage premium parking permits for executives and special guests
              </p>
            </div>
            <button
              onClick={handleAddPermit}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
            >
              <Icon name="PlusIcon" size={20} />
              <span>Add VIP Permit</span>
            </button>
          </div>

          {/* Stats Cards */}
          <VipPermitStats stats={calculateStats()} />

          {/* Filters */}
          <VipPermitFilters 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Permits Table */}
          <VipPermitTable
            permits={filteredPermits}
            onEdit={handleEditPermit}
            onDelete={handleDeletePermit}
            onStatusChange={handleStatusChange}
            selectedPermits={selectedPermits}
            onSelectPermit={handleSelectPermit}
            onSelectAll={handleSelectAll}
          />

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedPermits?.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedPermits([])}
          />

          {/* Add/Edit Modal */}
          <VipPermitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePermit}
            permit={editingPermit}
          />
        </div>
      </main>
    </div>
  );
};

VipPermitsInteractive.propTypes = {
  initialData: PropTypes?.shape({
    permits: PropTypes?.arrayOf(PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      name: PropTypes?.string?.isRequired,
      title: PropTypes?.string?.isRequired,
      company: PropTypes?.string?.isRequired,
      department: PropTypes?.string?.isRequired,
      email: PropTypes?.string?.isRequired,
      phone: PropTypes?.string?.isRequired,
      photo: PropTypes?.string?.isRequired,
      licensePlates: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
      accessLevel: PropTypes?.string?.isRequired,
      status: PropTypes?.string?.isRequired,
      createdAt: PropTypes?.string?.isRequired,
      updatedAt: PropTypes?.string?.isRequired
    }))?.isRequired
  })?.isRequired
};

export default VipPermitsInteractive;