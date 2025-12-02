'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TicketFilters from './TicketFilters';
import TicketTable from './TicketTable';
import EnforcementStats from './EnforcementStats';

const EnforcementReportsInteractive = ({ initialData }) => {
  const [tickets, setTickets] = useState(initialData?.tickets);
  const [filteredTickets, setFilteredTickets] = useState(initialData?.tickets);
  const [stats, setStats] = useState(initialData?.stats);
  const [filters, setFilters] = useState({
    dateRange: { startDate: '2024-11-01', endDate: '2024-11-18' },
    status: 'all',
    search: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, tickets]);

  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(ticket => ticket?.status === filters?.status);
    }

    // Apply search filter
    if (filters?.search?.trim()) {
      filtered = filtered?.filter(ticket =>
        ticket?.ticketId?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        ticket?.licensePlate?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply date range filter
    filtered = filtered?.filter(ticket => {
      const ticketDate = new Date(ticket.issueDate);
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      return ticketDate >= startDate && ticketDate <= endDate;
    });

    setFilteredTickets(filtered);
    updateStats(filtered);
  };

  const updateStats = (ticketList) => {
    const totalTickets = ticketList?.length;
    const paidTickets = ticketList?.filter(t => t?.status === 'paid');
    const pendingTickets = ticketList?.filter(t => t?.status === 'issued' || t?.status === 'overdue');
    const revenueCollected = paidTickets?.reduce((sum, ticket) => sum + ticket?.amount, 0);
    const collectionRate = totalTickets > 0 ? Math.round((paidTickets?.length / totalTickets) * 100) : 0;

    setStats({
      totalTickets,
      revenueCollected,
      pendingTickets: pendingTickets?.length,
      collectionRate
    });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTicketUpdate = (ticketId, updates) => {
    setTickets(prevTickets =>
      prevTickets?.map(ticket =>
        ticket?.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      'Ticket ID',
      'License Plate',
      'Violation Type',
      'Location',
      'Issue Date',
      'Issue Time',
      'Amount',
      'Status',
      'Officer',
      'Notes'
    ];

    const csvData = filteredTickets?.map(ticket => [
      ticket?.ticketId,
      ticket?.licensePlate,
      ticket?.violationType,
      ticket?.location,
      ticket?.issueDate,
      ticket?.issueTime,
      ticket?.amount,
      ticket?.status,
      ticket?.officer || '',
      ticket?.notes || ''
    ]);

    const csvContent = [
      csvHeaders?.join(','),
      ...csvData?.map(row => row?.map(field => `"${field}"`)?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enforcement-reports-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <EnforcementStats stats={stats} />
      <TicketFilters 
        onFiltersChange={handleFiltersChange}
        totalTickets={tickets?.length}
      />
      <TicketTable 
        tickets={filteredTickets}
        onTicketUpdate={handleTicketUpdate}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
};

EnforcementReportsInteractive.propTypes = {
  initialData: PropTypes?.shape({
    tickets: PropTypes?.array?.isRequired,
    stats: PropTypes?.object?.isRequired
  })?.isRequired
};

export default EnforcementReportsInteractive;