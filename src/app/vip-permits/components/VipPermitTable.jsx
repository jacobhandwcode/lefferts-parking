'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const VipPermitTable = ({ permits, onEdit, onDelete, onStatusChange, selectedPermits, onSelectPermit, onSelectAll }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success', bg: 'bg-success/10', label: 'Active' },
      expired: { color: 'text-error', bg: 'bg-error/10', label: 'Expired' },
      suspended: { color: 'text-warning', bg: 'bg-warning/10', label: 'Suspended' },
      pending: { color: 'text-secondary', bg: 'bg-secondary/10', label: 'Pending' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        {config?.label}
      </span>
    );
  };

  const getAccessLevelBadge = (level) => {
    const levelConfig = {
      executive: { color: 'text-primary', bg: 'bg-primary/10', icon: 'CrownIcon' },
      vip: { color: 'text-accent', bg: 'bg-accent/10', icon: 'StarIcon' },
      premium: { color: 'text-secondary', bg: 'bg-secondary/10', icon: 'ShieldCheckIcon' },
      guest: { color: 'text-muted-foreground', bg: 'bg-muted', icon: 'UserIcon' }
    };

    const config = levelConfig?.[level] || levelConfig?.guest;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{level}</span>
      </span>
    );
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

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <Icon name="ChevronUpDownIcon" size={16} className="text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <Icon name="ChevronUpIcon" size={16} className="text-primary" />
      : <Icon name="ChevronDownIcon" size={16} className="text-primary" />;
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedPermits?.length === permits?.length && permits?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>VIP Holder</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Company</span>
                  {getSortIcon('company')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">License Plates</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Contact</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('accessLevel')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Access Level</span>
                  {getSortIcon('accessLevel')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedPermits?.map((permit) => (
              <tr key={permit?.id} className="hover:bg-surface/50 transition-micro">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPermits?.includes(permit?.id)}
                    onChange={(e) => onSelectPermit(permit?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <AppImage
                      src={permit?.photo}
                      alt={`Professional headshot of ${permit?.name}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-foreground">{permit?.name}</div>
                      <div className="text-sm text-muted-foreground">{permit?.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-foreground">{permit?.company}</div>
                    <div className="text-sm text-muted-foreground">{permit?.department}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {permit?.licensePlates?.map((plate, index) => (
                      <div key={index} className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block mr-1">
                        {plate}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="text-foreground">{permit?.email}</div>
                    <div className="text-muted-foreground">{permit?.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getAccessLevelBadge(permit?.accessLevel)}
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(permit?.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(permit)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-micro"
                      title="Edit Permit"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onStatusChange(permit?.id, permit?.status === 'active' ? 'suspended' : 'active')}
                      className={`p-2 rounded-lg transition-micro ${
                        permit?.status === 'active' ?'text-warning hover:text-warning hover:bg-warning/10' :'text-success hover:text-success hover:bg-success/10'
                      }`}
                      title={permit?.status === 'active' ? 'Suspend Permit' : 'Activate Permit'}
                    >
                      <Icon name={permit?.status === 'active' ? 'PauseIcon' : 'PlayIcon'} size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(permit?.id)}
                      className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-micro"
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
      {permits?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="StarIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No VIP permits found</h3>
          <p className="text-muted-foreground">Create your first VIP permit to get started.</p>
        </div>
      )}
    </div>
  );
};

VipPermitTable.propTypes = {
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
    status: PropTypes?.string?.isRequired
  }))?.isRequired,
  onEdit: PropTypes?.func?.isRequired,
  onDelete: PropTypes?.func?.isRequired,
  onStatusChange: PropTypes?.func?.isRequired,
  selectedPermits: PropTypes?.arrayOf(PropTypes?.number)?.isRequired,
  onSelectPermit: PropTypes?.func?.isRequired,
  onSelectAll: PropTypes?.func?.isRequired
};

export default VipPermitTable;