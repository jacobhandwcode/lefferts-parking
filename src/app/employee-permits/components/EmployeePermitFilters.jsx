'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const EmployeePermitFilters = ({ onFilterChange, onSearch, onAddEmployee }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'administration', label: 'Administration' },
    { value: 'security', label: 'Security' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'customer_service', label: 'Customer Service' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'management', label: 'Management' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleDepartmentChange = (e) => {
    const value = e?.target?.value;
    setSelectedDepartment(value);
    onFilterChange({ department: value, status: selectedStatus });
  };

  const handleStatusChange = (e) => {
    const value = e?.target?.value;
    setSelectedStatus(value);
    onFilterChange({ department: selectedDepartment, status: value });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    onSearch('');
    onFilterChange({ department: 'all', status: 'all' });
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
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
              placeholder="Search employees or license plates..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-micro"
          >
            <Icon name="FunnelIcon" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </button>

          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4 w-full lg:w-auto`}>
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {departments?.map((dept) => (
                <option key={dept?.value} value={dept?.value}>
                  {dept?.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {statusOptions?.map((status) => (
                <option key={status?.value} value={status?.value}>
                  {status?.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro"
            >
              <Icon name="XMarkIcon" size={16} />
              <span className="text-sm">Clear</span>
            </button>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={onAddEmployee}
            className="flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
          >
            <Icon name="PlusIcon" size={20} />
            <span className="font-medium">Add Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
};

EmployeePermitFilters.propTypes = {
  onFilterChange: PropTypes?.func?.isRequired,
  onSearch: PropTypes?.func?.isRequired,
  onAddEmployee: PropTypes?.func?.isRequired
};

export default EmployeePermitFilters;