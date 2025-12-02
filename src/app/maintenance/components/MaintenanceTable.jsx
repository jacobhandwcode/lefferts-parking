'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const MaintenanceTable = ({ records }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Open': {
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: 'ExclamationCircleIcon'
      },
      'In Progress': {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'ClockIcon'
      },
      'Closed': {
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: 'CheckCircleIcon'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.['Open'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config?.className}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityConfig?.[priority] || priorityConfig?.['Medium']}`}>
        {priority}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRecords = records
    ?.filter(record => {
      if (!searchTerm) return true;
      const searchLower = searchTerm?.toLowerCase();
      return (
        record?.description?.toLowerCase()?.includes(searchLower) ||
        record?.lot?.toLowerCase()?.includes(searchLower) ||
        record?.openBy?.toLowerCase()?.includes(searchLower) ||
        record?.status?.toLowerCase()?.includes(searchLower) ||
        record?.category?.toLowerCase()?.includes(searchLower)
      );
    })
    ?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];

      // Handle date sorting
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-micro"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <Icon 
            name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
            size={12} 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="px-6 pt-4">
        <div className="relative">
          <Icon 
            name="MagnifyingGlassIcon" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search maintenance records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="date">Date</SortableHeader>
              <SortableHeader field="lot">Lot</SortableHeader>
              <SortableHeader field="openBy">Open By</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <SortableHeader field="priority">Priority</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {filteredAndSortedRecords?.map((record) => (
              <tr key={record?.id} className="hover:bg-muted/20 transition-micro">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {new Date(record?.date)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(record?.createdAt)?.toLocaleDateString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {record?.lot}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium">{record?.openBy}</span>
                    <span className="text-xs text-muted-foreground">
                      Assigned: {record?.assignedTo}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record?.status)}
                </td>
                <td className="px-6 py-4 text-sm text-foreground max-w-xs">
                  <div className="line-clamp-2">
                    {record?.description}
                  </div>
                  {record?.estimatedTime && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Est: {record?.estimatedTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(record?.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-surface rounded text-xs">
                    {record?.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-1 hover:bg-muted rounded transition-micro"
                      title="View Details"
                    >
                      <Icon name="EyeIcon" size={16} />
                    </button>
                    <button 
                      className="p-1 hover:bg-muted rounded transition-micro"
                      title="Edit Record"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                    <button 
                      className="p-1 hover:bg-muted rounded transition-micro text-red-600"
                      title="Delete Record"
                    >
                      <Icon name="TrashIcon" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedRecords?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="DocumentTextIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No maintenance records found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'No maintenance records match the selected date range'}
            </p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredAndSortedRecords?.length > 0 && (
        <div className="px-6 py-4 bg-muted/20 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedRecords?.length} of {records?.length} maintenance records
            </span>
            <div className="flex items-center space-x-4">
              <span>Open: {records?.filter(r => r?.status === 'Open')?.length}</span>
              <span>In Progress: {records?.filter(r => r?.status === 'In Progress')?.length}</span>
              <span>Closed: {records?.filter(r => r?.status === 'Closed')?.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

MaintenanceTable.propTypes = {
  records: PropTypes?.array?.isRequired
};

export default MaintenanceTable;