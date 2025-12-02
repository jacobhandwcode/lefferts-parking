'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TicketTable = ({ tickets, onTicketUpdate, onExportCSV }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'issueDate', direction: 'desc' });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTickets(tickets?.map(ticket => ticket?.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId, checked) => {
    if (checked) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev?.filter(id => id !== ticketId));
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      issued: { color: 'bg-warning/10 text-warning', label: 'Issued' },
      paid: { color: 'bg-success/10 text-success', label: 'Paid' },
      dismissed: { color: 'bg-muted text-muted-foreground', label: 'Dismissed' },
      refunded: { color: 'bg-error/10 text-error', label: 'Refunded' },
      overdue: { color: 'bg-error/20 text-error', label: 'Overdue' }
    };

    const config = statusConfig?.[status] || statusConfig?.issued;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getViolationIcon = (type) => {
    const iconMap = {
      'Expired Meter': 'ClockIcon',
      'No Permit': 'DocumentTextIcon',
      'Handicap Violation': 'ExclamationTriangleIcon',
      'Fire Lane': 'FireIcon',
      'Overtime Parking': 'CalendarIcon'
    };
    return iconMap?.[type] || 'ExclamationCircleIcon';
  };

  const sortedTickets = [...tickets]?.sort((a, b) => {
    if (sortConfig?.key) {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const handleStatusUpdate = (ticketId, newStatus) => {
    onTicketUpdate(ticketId, { status: newStatus });
  };

  const handleBulkStatusUpdate = (newStatus) => {
    selectedTickets?.forEach(ticketId => {
      onTicketUpdate(ticketId, { status: newStatus });
    });
    setSelectedTickets([]);
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Table Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-border bg-surface">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <span className="text-sm font-medium text-foreground">
            {selectedTickets?.length > 0 ? `${selectedTickets?.length} selected` : `${tickets?.length} tickets`}
          </span>
          {selectedTickets?.length > 0 && (
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e?.target?.value)}
                className="px-3 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue=""
              >
                <option value="" disabled>Update Status</option>
                <option value="paid">Mark as Paid</option>
                <option value="dismissed">Dismiss</option>
                <option value="refunded">Refund</option>
              </select>
            </div>
          )}
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
        >
          <Icon name="ArrowDownTrayIcon" size={16} />
          <span>Export CSV</span>
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
                  checked={selectedTickets?.length === tickets?.length && tickets?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border focus:ring-primary"
                />
              </th>
              {[
                { key: 'ticketId', label: 'Ticket ID' },
                { key: 'licensePlate', label: 'License Plate' },
                { key: 'violationType', label: 'Violation' },
                { key: 'location', label: 'Location' },
                { key: 'issueDate', label: 'Issue Date' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  {column?.key !== 'actions' ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-1 hover:text-foreground"
                    >
                      <span>{column?.label}</span>
                      <Icon 
                        name="ChevronUpDownIcon" 
                        size={14} 
                        className={sortConfig?.key === column?.key ? 'text-primary' : 'text-muted-foreground'} 
                      />
                    </button>
                  ) : (
                    column?.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTickets?.map((ticket) => (
              <tr key={ticket?.id} className="hover:bg-muted/50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTickets?.includes(ticket?.id)}
                    onChange={(e) => handleSelectTicket(ticket?.id, e?.target?.checked)}
                    className="rounded border-border focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-primary">
                    {ticket?.ticketId}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {ticket?.licensePlate}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getViolationIcon(ticket?.violationType)} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm text-foreground">{ticket?.violationType}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{ticket?.location}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="text-foreground">{ticket?.issueDate}</div>
                    <div className="text-muted-foreground">{ticket?.issueTime}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">
                    ${ticket?.amount?.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(ticket?.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(ticket?.id, 'paid')}
                      className="p-1 text-success hover:bg-success/10 rounded transition-micro"
                      title="Mark as Paid"
                    >
                      <Icon name="CheckIcon" size={16} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(ticket?.id, 'dismissed')}
                      className="p-1 text-muted-foreground hover:bg-muted rounded transition-micro"
                      title="Dismiss"
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                    <button className="p-1 text-primary hover:bg-primary/10 rounded transition-micro">
                      <Icon name="EyeIcon" size={16} />
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
        {sortedTickets?.map((ticket) => (
          <div key={ticket?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTickets?.includes(ticket?.id)}
                  onChange={(e) => handleSelectTicket(ticket?.id, e?.target?.checked)}
                  className="rounded border-border focus:ring-primary"
                />
                <div>
                  <div className="font-mono text-sm font-medium text-primary">
                    {ticket?.ticketId}
                  </div>
                  <div className="font-mono text-sm text-foreground">
                    {ticket?.licensePlate}
                  </div>
                </div>
              </div>
              {getStatusBadge(ticket?.status)}
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getViolationIcon(ticket?.violationType)} 
                  size={16} 
                  className="text-muted-foreground" 
                />
                <span className="text-sm text-foreground">{ticket?.violationType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPinIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{ticket?.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CalendarIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {ticket?.issueDate} at {ticket?.issueTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CurrencyDollarIcon" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  ${ticket?.amount?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStatusUpdate(ticket?.id, 'paid')}
                className="flex items-center space-x-1 px-3 py-1 text-success hover:bg-success/10 rounded transition-micro"
              >
                <Icon name="CheckIcon" size={14} />
                <span className="text-xs">Paid</span>
              </button>
              <button
                onClick={() => handleStatusUpdate(ticket?.id, 'dismissed')}
                className="flex items-center space-x-1 px-3 py-1 text-muted-foreground hover:bg-muted rounded transition-micro"
              >
                <Icon name="XMarkIcon" size={14} />
                <span className="text-xs">Dismiss</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 text-primary hover:bg-primary/10 rounded transition-micro">
                <Icon name="EyeIcon" size={14} />
                <span className="text-xs">View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TicketTable.propTypes = {
  tickets: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.string?.isRequired,
    ticketId: PropTypes?.string?.isRequired,
    licensePlate: PropTypes?.string?.isRequired,
    violationType: PropTypes?.string?.isRequired,
    location: PropTypes?.string?.isRequired,
    issueDate: PropTypes?.string?.isRequired,
    issueTime: PropTypes?.string?.isRequired,
    amount: PropTypes?.number?.isRequired,
    status: PropTypes?.string?.isRequired
  }))?.isRequired,
  onTicketUpdate: PropTypes?.func?.isRequired,
  onExportCSV: PropTypes?.func?.isRequired
};

export default TicketTable;