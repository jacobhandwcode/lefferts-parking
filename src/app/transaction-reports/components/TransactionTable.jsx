'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TransactionTable = ({ transactions, onSort, sortConfig }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());

  const columns = [
    { key: 'select', label: '', width: 'w-12', sortable: false },
    { key: 'timestamp', label: 'Date & Time', width: 'w-36', sortable: true },
    { key: 'transaction_id', label: 'Transaction ID', width: 'w-32', sortable: true },
    { key: 'location', label: 'Location', width: 'w-28', sortable: true },
    { key: 'license_plate', label: 'License Plate', width: 'w-28', sortable: true },
    { key: 'customer_name', label: 'Customer', width: 'w-32', sortable: true },
    { key: 'transaction_type', label: 'Type', width: 'w-32', sortable: true },
    { key: 'duration', label: 'Duration', width: 'w-24', sortable: true },
    { key: 'pricing_mode', label: 'Pricing Mode', width: 'w-28', sortable: true },
    { key: 'amount', label: 'Amount', width: 'w-24', sortable: true },
    { key: 'payment_method', label: 'Payment Method', width: 'w-32', sortable: true },
    { key: 'payment_reference', label: 'Payment Ref', width: 'w-32', sortable: true },
    { key: 'permit_number', label: 'Permit #', width: 'w-28', sortable: true },
    { key: 'permit_type', label: 'Permit Type', width: 'w-28', sortable: true },
    { key: 'enforcement_action', label: 'Enforcement', width: 'w-28', sortable: true },
    { key: 'violation_id', label: 'Violation ID', width: 'w-28', sortable: true },
    { key: 'discount_applied', label: 'Discount', width: 'w-24', sortable: true },
    { key: 'tax_amount', label: 'Tax', width: 'w-20', sortable: true },
    { key: 'total_amount', label: 'Total', width: 'w-24', sortable: true },
    { key: 'status', label: 'Status', width: 'w-24', sortable: true },
    { key: 'processed_by', label: 'Processed By', width: 'w-32', sortable: true },
    { key: 'notes', label: 'Notes', width: 'w-40', sortable: false },
    { key: 'actions', label: 'Actions', width: 'w-20', sortable: false }
  ];

  const handleSort = (columnKey) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  const toggleRowExpansion = (transactionId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(transactionId)) {
      newExpanded?.delete(transactionId);
    } else {
      newExpanded?.add(transactionId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleRowSelection = (transactionId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected?.has(transactionId)) {
      newSelected?.delete(transactionId);
    } else {
      newSelected?.add(transactionId);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows?.size === transactions?.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(transactions.map(t => t.id)));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-error/10 text-error';
      case 'refunded':
        return 'bg-secondary/10 text-secondary';
      case 'disputed':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount || 0);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`${column?.width} px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide`}
                >
                  {column?.key === 'select' ? (
                    <input
                      type="checkbox"
                      checked={selectedRows?.size === transactions?.length && transactions?.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>{column?.label}</span>
                      {column?.sortable && (
                        <button
                          onClick={() => handleSort(column?.key)}
                          className="p-1 hover:bg-muted rounded transition-micro"
                        >
                          <Icon 
                            name="ChevronUpDownIcon" 
                            size={12} 
                            className={`${
                              sortConfig?.key === column?.key 
                                ? 'text-primary' :'text-muted-foreground'
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions?.map((transaction, index) => (
              <React.Fragment key={transaction?.id}>
                <tr className={`hover:bg-surface transition-micro ${index % 2 === 0 ? 'bg-white' : 'bg-surface/30'}`}>
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows?.has(transaction?.id)}
                      onChange={() => toggleRowSelection(transaction?.id)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    <div>{transaction?.date}</div>
                    <div className="text-xs text-muted-foreground">{transaction?.time}</div>
                  </td>
                  <td className="px-3 py-4 text-sm font-mono text-foreground">
                    {transaction?.transaction_id}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.location}
                  </td>
                  <td className="px-3 py-4 text-sm font-mono text-foreground">
                    {transaction?.license_plate}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.customer_name || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.transaction_type}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {formatDuration(transaction?.duration)}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.pricing_mode}
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-foreground">
                    {formatCurrency(transaction?.amount)}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.payment_method}
                  </td>
                  <td className="px-3 py-4 text-sm font-mono text-foreground">
                    {transaction?.payment_reference || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm font-mono text-foreground">
                    {transaction?.permit_number || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.permit_type || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.enforcement_action || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm font-mono text-foreground">
                    {transaction?.violation_id || '-'}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.discount_applied ? formatCurrency(transaction?.discount_applied) : '-'}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {formatCurrency(transaction?.tax_amount)}
                  </td>
                  <td className="px-3 py-4 text-sm font-medium text-foreground">
                    {formatCurrency(transaction?.total_amount)}
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction?.status)}`}>
                      {transaction?.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    {transaction?.processed_by}
                  </td>
                  <td className="px-3 py-4 text-sm text-foreground">
                    <div className="max-w-40 truncate" title={transaction?.notes}>
                      {transaction?.notes || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleRowExpansion(transaction?.id)}
                        className="p-1 hover:bg-muted rounded transition-micro"
                        title="View Details"
                      >
                        <Icon 
                          name={expandedRows?.has(transaction?.id) ? "ChevronUpIcon" : "ChevronDownIcon"} 
                          size={16} 
                          className="text-muted-foreground" 
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows?.has(transaction?.id) && (
                  <tr>
                    <td colSpan={columns?.length} className="px-3 py-4 bg-surface/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Transaction Details</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div>Entry Time: {transaction?.entry_time}</div>
                            <div>Exit Time: {transaction?.exit_time}</div>
                            <div>Space Number: {transaction?.space_number}</div>
                            <div>Zone: {transaction?.zone}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Payment Information</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div>Card Last 4: {transaction?.card_last_four}</div>
                            <div>Authorization: {transaction?.auth_code}</div>
                            <div>Gateway: {transaction?.payment_gateway}</div>
                            <div>Processor Fee: {formatCurrency(transaction?.processor_fee)}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Additional Info</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <div>Created: {transaction?.created_at}</div>
                            <div>Updated: {transaction?.updated_at}</div>
                            <div>IP Address: {transaction?.ip_address}</div>
                            <div>User Agent: {transaction?.user_agent}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TransactionTable.propTypes = {
  transactions: PropTypes?.arrayOf(
    PropTypes?.shape({
      id: PropTypes?.number?.isRequired,
      transaction_id: PropTypes?.string?.isRequired,
      date: PropTypes?.string?.isRequired,
      time: PropTypes?.string?.isRequired,
      location: PropTypes?.string?.isRequired,
      license_plate: PropTypes?.string?.isRequired,
      customer_name: PropTypes?.string,
      transaction_type: PropTypes?.string?.isRequired,
      duration: PropTypes?.number,
      pricing_mode: PropTypes?.string?.isRequired,
      amount: PropTypes?.number?.isRequired,
      payment_method: PropTypes?.string?.isRequired,
      payment_reference: PropTypes?.string,
      permit_number: PropTypes?.string,
      permit_type: PropTypes?.string,
      enforcement_action: PropTypes?.string,
      violation_id: PropTypes?.string,
      discount_applied: PropTypes?.number,
      tax_amount: PropTypes?.number?.isRequired,
      total_amount: PropTypes?.number?.isRequired,
      status: PropTypes?.string?.isRequired,
      processed_by: PropTypes?.string?.isRequired,
      notes: PropTypes?.string,
      entry_time: PropTypes?.string,
      exit_time: PropTypes?.string,
      space_number: PropTypes?.string,
      zone: PropTypes?.string,
      card_last_four: PropTypes?.string,
      auth_code: PropTypes?.string,
      payment_gateway: PropTypes?.string,
      processor_fee: PropTypes?.number,
      created_at: PropTypes?.string,
      updated_at: PropTypes?.string,
      ip_address: PropTypes?.string,
      user_agent: PropTypes?.string
    })
  )?.isRequired,
  onSort: PropTypes?.func,
  sortConfig: PropTypes?.shape({
    key: PropTypes?.string,
    direction: PropTypes?.oneOf(['asc', 'desc'])
  })
};

export default TransactionTable;