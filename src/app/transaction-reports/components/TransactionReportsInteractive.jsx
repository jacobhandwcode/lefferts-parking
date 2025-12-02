'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import TransactionFilters from './TransactionFilters';
import TransactionSearch from './TransactionSearch';
import TransactionSummary from './TransactionSummary';
import TransactionTable from './TransactionTable';
import TransactionPagination from './TransactionPagination';

const TransactionReportsInteractive = ({ initialData }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState(initialData?.transactions);
  const [filteredTransactions, setFilteredTransactions] = useState(initialData?.transactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions?.slice(startIndex, startIndex + itemsPerPage);

  // Calculate summary data
  const summaryData = {
    totalTransactions: filteredTransactions?.length,
    totalRevenue: filteredTransactions?.reduce((sum, t) => sum + t?.total_amount, 0),
    averageTransaction: filteredTransactions?.length > 0 
      ? filteredTransactions?.reduce((sum, t) => sum + t?.total_amount, 0) / filteredTransactions?.length 
      : 0,
    completedTransactions: filteredTransactions?.filter(t => t?.status === 'Completed')?.length,
    pendingTransactions: filteredTransactions?.filter(t => t?.status === 'Pending')?.length,
    failedTransactions: filteredTransactions?.filter(t => t?.status === 'Failed')?.length
  };

  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(transaction => 
        transaction?.license_plate?.toLowerCase()?.includes(query) ||
        transaction?.transaction_id?.toLowerCase()?.includes(query) ||
        transaction?.payment_reference?.toLowerCase()?.includes(query) ||
        transaction?.customer_name?.toLowerCase()?.includes(query)
      );
    }

    // Apply filters
    if (filters?.dateRange?.startDate) {
      filtered = filtered?.filter(t => new Date(t.date) >= new Date(filters.dateRange.startDate));
    }
    if (filters?.dateRange?.endDate) {
      filtered = filtered?.filter(t => new Date(t.date) <= new Date(filters.dateRange.endDate));
    }
    if (filters?.location) {
      filtered = filtered?.filter(t => t?.location === filters?.location);
    }
    if (filters?.transactionType) {
      filtered = filtered?.filter(t => t?.transaction_type === filters?.transactionType);
    }
    if (filters?.paymentMethod) {
      filtered = filtered?.filter(t => t?.payment_method === filters?.paymentMethod);
    }
    if (filters?.status) {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }
    if (filters?.amountRange?.min) {
      filtered = filtered?.filter(t => t?.total_amount >= parseFloat(filters?.amountRange?.min));
    }
    if (filters?.amountRange?.max) {
      filtered = filtered?.filter(t => t?.total_amount <= parseFloat(filters?.amountRange?.max));
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'timestamp') {
          aValue = new Date(`${a.date} ${a.time}`);
          bValue = new Date(`${b.date} ${b.time}`);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, filters, searchQuery, sortConfig]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = ({ query }) => {
    setSearchQuery(query);
  };

  const handleSort = (columnKey) => {
    setSortConfig(prevConfig => ({
      key: columnKey,
      direction: prevConfig?.key === columnKey && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Date', 'Time', 'Transaction ID', 'Location', 'License Plate', 'Customer Name',
      'Transaction Type', 'Duration', 'Pricing Mode', 'Amount', 'Payment Method',
      'Payment Reference', 'Permit Number', 'Permit Type', 'Enforcement Action',
      'Violation ID', 'Discount Applied', 'Tax Amount', 'Total Amount', 'Status',
      'Processed By', 'Notes'
    ];

    const csvContent = [
      headers?.join(','),
      ...filteredTransactions?.map(transaction => [
        transaction?.date,
        transaction?.time,
        transaction?.transaction_id,
        transaction?.location,
        transaction?.license_plate,
        transaction?.customer_name || '',
        transaction?.transaction_type,
        transaction?.duration || '',
        transaction?.pricing_mode,
        transaction?.amount,
        transaction?.payment_method,
        transaction?.payment_reference || '',
        transaction?.permit_number || '',
        transaction?.permit_type || '',
        transaction?.enforcement_action || '',
        transaction?.violation_id || '',
        transaction?.discount_applied || '',
        transaction?.tax_amount,
        transaction?.total_amount,
        transaction?.status,
        transaction?.processed_by,
        `"${transaction?.notes || ''}"`
      ]?.join(','))
    ]?.join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `transaction-reports-${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-72'} mt-16`}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Transaction Reports</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analysis of parking transactions with detailed filtering and export capabilities
            </p>
          </div>

          <TransactionSummary summaryData={summaryData} />

          <TransactionFilters 
            onFiltersChange={handleFiltersChange}
            totalResults={filteredTransactions?.length}
          />

          <TransactionSearch 
            onSearch={handleSearch}
            onExport={handleExport}
          />

          <TransactionTable 
            transactions={paginatedTransactions}
            onSort={handleSort}
            sortConfig={sortConfig}
          />

          <TransactionPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTransactions?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </main>
    </div>
  );
};

TransactionReportsInteractive.propTypes = {
  initialData: PropTypes?.shape({
    transactions: PropTypes?.array?.isRequired
  })?.isRequired
};

export default TransactionReportsInteractive;