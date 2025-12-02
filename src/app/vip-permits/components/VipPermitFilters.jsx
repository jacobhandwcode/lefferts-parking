'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const VipPermitFilters = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending' }
  ];

  const companyOptions = [
    { value: 'all', label: 'All Companies' },
    { value: 'tech_corp', label: 'Tech Corporation' },
    { value: 'global_finance', label: 'Global Finance Ltd' },
    { value: 'medical_center', label: 'Medical Center Group' },
    { value: 'law_firm', label: 'Premier Law Firm' },
    { value: 'consulting', label: 'Elite Consulting' }
  ];

  const accessLevelOptions = [
    { value: 'all', label: 'All Access Levels' },
    { value: 'executive', label: 'Executive' },
    { value: 'vip', label: 'VIP' },
    { value: 'premium', label: 'Premium' },
    { value: 'guest', label: 'Guest' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (e) => {
    const value = e?.target?.value;
    setSelectedStatus(value);
    onFilterChange({ type: 'status', value });
  };

  const handleCompanyChange = (e) => {
    const value = e?.target?.value;
    setSelectedCompany(value);
    onFilterChange({ type: 'company', value });
  };

  const handleAccessLevelChange = (e) => {
    const value = e?.target?.value;
    setSelectedAccessLevel(value);
    onFilterChange({ type: 'accessLevel', value });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedCompany('all');
    setSelectedAccessLevel('all');
    onSearch('');
    onFilterChange({ type: 'clear' });
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="MagnifyingGlassIcon" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, company, or license plate..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[140px]"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[160px]"
          >
            {companyOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          <select
            value={selectedAccessLevel}
            onChange={handleAccessLevelChange}
            className="px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white min-w-[150px]"
          >
            {accessLevelOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-micro flex items-center space-x-2"
          >
            <Icon name="XMarkIcon" size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

VipPermitFilters.propTypes = {
  onFilterChange: PropTypes?.func?.isRequired,
  onSearch: PropTypes?.func?.isRequired
};

export default VipPermitFilters;