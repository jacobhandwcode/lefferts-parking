'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import PermitStatusBadge from './PermitStatusBadge';

const PermitDataTable = ({ permits, onEdit, onDeactivate, onDelete, onBulkAction, selectedPermits, onSelectPermit, onSelectAll }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPermits = [...permits]?.sort((a, b) => {
    if (!sortConfig?.key) return 0;

    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];

    if (sortConfig?.key === 'issueDate' || sortConfig?.key === 'expiryDate') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      return sortConfig?.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPermits?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPermits = sortedPermits?.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 11 && cleaned?.startsWith('1')) {
      return `+1 ${cleaned?.slice(1, 4)} ${cleaned?.slice(4, 7)}-${cleaned?.slice(7)}`;
    }
    return phone;
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ChevronUpDownIcon" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ChevronUpIcon" size={14} className="text-primary" />
      : <Icon name="ChevronDownIcon" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedPermits?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">
                {selectedPermits?.length} permit{selectedPermits?.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkAction('renew')}
                className="px-3 py-1.5 bg-success text-white text-xs font-medium rounded-lg hover:bg-success/90 transition-micro"
              >
                Bulk Renew
              </button>
              <button
                onClick={() => onBulkAction('deactivate')}
                className="px-3 py-1.5 bg-warning text-white text-xs font-medium rounded-lg hover:bg-warning/90 transition-micro"
              >
                Bulk Deactivate
              </button>
              <button
                onClick={() => onBulkAction('export')}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-micro"
              >
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedPermits?.length === permits?.length && permits?.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('permitId')}
                  className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
                >
                  <span>Permit ID</span>
                  {getSortIcon('permitId')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('holderName')}
                  className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
                >
                  <span>Permit Holder</span>
                  {getSortIcon('holderName')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  License Plates
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('issueDate')}
                  className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
                >
                  <span>Issue Date</span>
                  {getSortIcon('issueDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('expiryDate')}
                  className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
                >
                  <span>Expiry Date</span>
                  {getSortIcon('expiryDate')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Location
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedPermits?.map((permit) => (
              <tr key={permit?.id} className="hover:bg-surface/50 transition-micro">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPermits?.includes(permit?.id)}
                    onChange={() => onSelectPermit(permit?.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {permit?.permitId}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {permit?.holderName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {permit?.holderId}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {permit?.vehicles?.slice(0, 2)?.map((vehicle, index) => (
                      <div key={index} className="font-mono text-xs bg-surface px-2 py-1 rounded">
                        {vehicle?.licensePlate}
                      </div>
                    ))}
                    {permit?.vehicles?.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{permit?.vehicles?.length - 2} more
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm text-foreground">
                      {permit?.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPhoneNumber(permit?.phone)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {formatDate(permit?.issueDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {formatDate(permit?.expiryDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {permit?.location}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PermitStatusBadge 
                    status={permit?.status} 
                    expiryDate={permit?.expiryDate} 
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onEdit(permit)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-micro"
                      title="Edit Permit"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onDeactivate(permit?.id)}
                      className="p-1.5 text-muted-foreground hover:text-warning hover:bg-warning/10 rounded-lg transition-micro"
                      title="Deactivate Permit"
                    >
                      <Icon name="PauseIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(permit?.id)}
                      className="p-1.5 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-micro"
                      title="Delete Permit"
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
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPermits?.length)} of {sortedPermits?.length} permits
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-micro ${
                      currentPage === pageNum
                        ? 'bg-primary text-white' :'border border-border hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

PermitDataTable.propTypes = {
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
  }))?.isRequired,
  onEdit: PropTypes?.func?.isRequired,
  onDeactivate: PropTypes?.func?.isRequired,
  onDelete: PropTypes?.func?.isRequired,
  onBulkAction: PropTypes?.func?.isRequired,
  selectedPermits: PropTypes?.arrayOf(PropTypes?.number)?.isRequired,
  onSelectPermit: PropTypes?.func?.isRequired,
  onSelectAll: PropTypes?.func?.isRequired
};

export default PermitDataTable;