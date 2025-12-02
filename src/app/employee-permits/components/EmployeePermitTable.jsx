'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const EmployeePermitTable = ({ 
  permits, 
  selectedPermits, 
  onSelectPermit, 
  onSelectAll, 
  onEditPermit, 
  onDeactivatePermit, 
  onDeletePermit,
  onExportCSV 
}) => {
  const [sortField, setSortField] = useState('employeeName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPermits = [...permits]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedPermits?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPermits = sortedPermits?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      suspended: { color: 'bg-warning/10 text-warning', label: 'Suspended' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ChevronUpDownIcon" size={16} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
        size={16} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Table Header Actions */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedPermits?.length === permits?.length && permits?.length > 0}
              onChange={onSelectAll}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              {selectedPermits?.length > 0 ? `${selectedPermits?.length} selected` : 'Select all'}
            </span>
          </div>
          
          {selectedPermits?.length > 0 && (
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-micro">
                <Icon name="PencilIcon" size={16} />
                <span>Bulk Edit</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-warning/10 text-warning hover:bg-warning/20 rounded-lg transition-micro">
                <Icon name="PauseIcon" size={16} />
                <span>Deactivate</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onExportCSV}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-micro"
        >
          <Icon name="ArrowDownTrayIcon" size={16} />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedPermits?.length === permits?.length && permits?.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('employeeName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Employee</span>
                  <SortIcon field="employeeName" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Department</span>
                  <SortIcon field="department" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('licensePlate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>License Plate</span>
                  <SortIcon field="licensePlate" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('issueDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Issue Date</span>
                  <SortIcon field="issueDate" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-right px-4 py-3">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedPermits?.map((permit) => (
              <tr key={permit?.id} className="hover:bg-surface/50 transition-micro">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPermits?.includes(permit?.id)}
                    onChange={() => onSelectPermit(permit?.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <AppImage
                      src={permit?.employeePhoto}
                      alt={`Profile photo of ${permit?.employeeName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{permit?.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{permit?.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{permit?.department}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-mono text-sm font-medium text-foreground">
                    {permit?.licensePlate}
                  </div>
                  {permit?.vehicleCount > 1 && (
                    <div className="text-xs text-muted-foreground">
                      +{permit?.vehicleCount - 1} more vehicle{permit?.vehicleCount > 2 ? 's' : ''}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{formatDate(permit?.issueDate)}</div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(permit?.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEditPermit(permit)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-micro"
                      title="Edit permit"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onDeactivatePermit(permit?.id)}
                      className="p-2 text-muted-foreground hover:text-warning hover:bg-warning/5 rounded-lg transition-micro"
                      title="Deactivate permit"
                    >
                      <Icon name="PauseIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onDeletePermit(permit?.id)}
                      className="p-2 text-muted-foreground hover:text-error hover:bg-error/5 rounded-lg transition-micro"
                      title="Delete permit"
                    >
                      <Icon name="TrashIcon" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedPermits?.map((permit) => (
          <div key={permit?.id} className="p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedPermits?.includes(permit?.id)}
                onChange={() => onSelectPermit(permit?.id)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-1"
              />
              <AppImage
                src={permit?.employeePhoto}
                alt={`Profile photo of ${permit?.employeeName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground">{permit?.employeeName}</div>
                  {getStatusBadge(permit?.status)}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">ID: {permit?.employeeId}</div>
                  <div className="text-muted-foreground">Dept: {permit?.department}</div>
                  <div className="font-mono font-medium text-foreground">{permit?.licensePlate}</div>
                  <div className="text-muted-foreground">Issued: {formatDate(permit?.issueDate)}</div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={() => onEditPermit(permit)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg"
                  >
                    <Icon name="PencilIcon" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeactivatePermit(permit?.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-warning/10 text-warning rounded-lg"
                  >
                    <Icon name="PauseIcon" size={14} />
                    <span>Deactivate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, permits?.length)} of {permits?.length} permits
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeftIcon" size={16} />
            </button>
            <span className="text-sm font-medium text-foreground">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-micro disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronRightIcon" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EmployeePermitTable.propTypes = {
  permits: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    employeeName: PropTypes?.string?.isRequired,
    employeeId: PropTypes?.string?.isRequired,
    employeePhoto: PropTypes?.string?.isRequired,
    department: PropTypes?.string?.isRequired,
    licensePlate: PropTypes?.string?.isRequired,
    vehicleCount: PropTypes?.number?.isRequired,
    issueDate: PropTypes?.string?.isRequired,
    status: PropTypes?.oneOf(['active', 'inactive', 'suspended'])?.isRequired
  }))?.isRequired,
  selectedPermits: PropTypes?.arrayOf(PropTypes?.string)?.isRequired,
  onSelectPermit: PropTypes?.func?.isRequired,
  onSelectAll: PropTypes?.func?.isRequired,
  onEditPermit: PropTypes?.func?.isRequired,
  onDeactivatePermit: PropTypes?.func?.isRequired,
  onDeletePermit: PropTypes?.func?.isRequired,
  onExportCSV: PropTypes?.func?.isRequired
};

export default EmployeePermitTable;