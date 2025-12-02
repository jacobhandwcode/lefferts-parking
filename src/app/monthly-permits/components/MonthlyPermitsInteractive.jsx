'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import GlobalSearch from '@/components/common/GlobalSearch';
import Icon from '@/components/ui/AppIcon';
import PermitFilters from './PermitFilters';
import PermitDataTable from './PermitDataTable';
import AddPermitModal from './AddPermitModal';

const MonthlyPermitsInteractive = ({ initialData }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permits, setPermits] = useState(initialData?.permits);
  const [filteredPermits, setFilteredPermits] = useState(initialData?.permits);
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    expiry: 'all',
    location: 'all'
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter permits based on search and filters
  useEffect(() => {
    let filtered = [...permits];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(permit =>
        permit?.permitId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        permit?.holderName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        permit?.vehicles?.some(vehicle => 
          vehicle?.licensePlate?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        ) ||
        permit?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      if (filters?.status === 'expiring') {
        filtered = filtered?.filter(permit => {
          const today = new Date();
          const expiry = new Date(permit.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        });
      } else {
        filtered = filtered?.filter(permit => permit?.status === filters?.status);
      }
    }

    // Apply expiry filter
    if (filters?.expiry !== 'all') {
      const today = new Date();
      filtered = filtered?.filter(permit => {
        const expiry = new Date(permit.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        switch (filters?.expiry) {
          case 'next_7_days':
            return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
          case 'next_30_days':
            return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
          case 'expired':
            return daysUntilExpiry < 0;
          default:
            return true;
        }
      });
    }

    // Apply location filter
    if (filters?.location !== 'all') {
      filtered = filtered?.filter(permit => permit?.location === filters?.location);
    }

    setFilteredPermits(filtered);
  }, [permits, searchQuery, filters]);

  const handleSearch = (result) => {
    if (result?.type === 'search') {
      setSearchQuery(result?.value);
    } else {
      setSearchQuery(result?.value);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectPermit = (permitId) => {
    setSelectedPermits(prev => 
      prev?.includes(permitId)
        ? prev?.filter(id => id !== permitId)
        : [...prev, permitId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermits?.length === filteredPermits?.length) {
      setSelectedPermits([]);
    } else {
      setSelectedPermits(filteredPermits?.map(permit => permit?.id));
    }
  };

  const handleAddPermit = async (permitData) => {
    const newPermit = {
      id: permits?.length + 1,
      ...permitData
    };
    
    setPermits(prev => [...prev, newPermit]);
    setSuccessMessage('Monthly permit created successfully');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleEditPermit = (permit) => {
    console.log('Edit permit:', permit);
    // Implementation for edit functionality
  };

  const handleDeactivatePermit = (permitId) => {
    setPermits(prev => 
      prev?.map(permit => 
        permit?.id === permitId 
          ? { ...permit, status: 'inactive' }
          : permit
      )
    );
    setSuccessMessage('Permit deactivated successfully');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeletePermit = (permitId) => {
    if (window.confirm('Are you sure you want to delete this permit? This action cannot be undone.')) {
      setPermits(prev => prev?.filter(permit => permit?.id !== permitId));
      setSelectedPermits(prev => prev?.filter(id => id !== permitId));
      setSuccessMessage('Permit deleted successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'renew':
        setPermits(prev => 
          prev?.map(permit => 
            selectedPermits?.includes(permit?.id)
              ? { 
                  ...permit, 
                  status: 'active',
                  expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
                }
              : permit
          )
        );
        setSuccessMessage(`${selectedPermits?.length} permits renewed successfully`);
        break;
      case 'deactivate':
        setPermits(prev => 
          prev?.map(permit => 
            selectedPermits?.includes(permit?.id)
              ? { ...permit, status: 'inactive' }
              : permit
          )
        );
        setSuccessMessage(`${selectedPermits?.length} permits deactivated successfully`);
        break;
      case 'export':
        console.log('Exporting permits:', selectedPermits);
        setSuccessMessage(`${selectedPermits?.length} permits exported successfully`);
        break;
    }
    
    setSelectedPermits([]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleExportAll = () => {
    console.log('Exporting all permits');
    setSuccessMessage('All permits exported successfully');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getActivePermitsCount = () => {
    return permits?.filter(permit => permit?.status === 'active')?.length;
  };

  const getExpiringPermitsCount = () => {
    const today = new Date();
    return permits?.filter(permit => {
      const expiry = new Date(permit.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    })?.length;
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 ${
        sidebarCollapsed ? 'ml-16' : 'ml-72'
      } mt-16 p-6`}>
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-3">
            <Icon name="CheckCircleIcon" size={20} className="text-success" />
            <span className="text-sm font-medium text-success">{successMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Monthly Permits</h1>
              <p className="text-sm text-muted-foreground">
                Manage time-limited parking permits with expiration tracking
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportAll}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-micro"
              >
                <Icon name="ArrowDownTrayIcon" size={16} />
                <span className="text-sm font-medium">Export All</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
              >
                <Icon name="PlusIcon" size={16} />
                <span className="text-sm font-medium">Add Permit</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="DocumentTextIcon" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">{permits?.length}</div>
                  <div className="text-xs text-muted-foreground">Total Permits</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircleIcon" size={20} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">{getActivePermitsCount()}</div>
                  <div className="text-xs text-muted-foreground">Active Permits</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="ClockIcon" size={20} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">{getExpiringPermitsCount()}</div>
                  <div className="text-xs text-muted-foreground">Expiring Soon</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="TruckIcon" size={20} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    {permits?.reduce((total, permit) => total + permit?.vehicles?.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Vehicles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <GlobalSearch
              placeholder="Search by permit ID, holder name, license plate, or email..."
              onSearch={handleSearch}
              className="max-w-2xl"
            />
          </div>
        </div>

        {/* Filters */}
        <PermitFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Data Table */}
        <PermitDataTable
          permits={filteredPermits}
          onEdit={handleEditPermit}
          onDeactivate={handleDeactivatePermit}
          onDelete={handleDeletePermit}
          onBulkAction={handleBulkAction}
          selectedPermits={selectedPermits}
          onSelectPermit={handleSelectPermit}
          onSelectAll={handleSelectAll}
        />

        {/* Add Permit Modal */}
        <AddPermitModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddPermit}
        />
      </main>
    </div>
  );
};

MonthlyPermitsInteractive.propTypes = {
  initialData: PropTypes?.shape({
    permits: PropTypes?.arrayOf(PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      permitId: PropTypes?.string?.isRequired,
      holderName: PropTypes?.string?.isRequired,
      holderId: PropTypes?.string?.isRequired,
      email: PropTypes?.string?.isRequired,
      phone: PropTypes?.string?.isRequired,
      vehicles: PropTypes?.arrayOf(PropTypes?.shape({
        licensePlate: PropTypes?.string?.isRequired,
        make: PropTypes?.string,
        model: PropTypes?.string,
        color: PropTypes?.string
      }))?.isRequired,
      issueDate: PropTypes?.string?.isRequired,
      expiryDate: PropTypes?.string?.isRequired,
      location: PropTypes?.string?.isRequired,
      status: PropTypes?.string?.isRequired
    }))?.isRequired
  })?.isRequired
};

export default MonthlyPermitsInteractive;