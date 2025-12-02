'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const TransactionPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const itemsPerPageOptions = [25, 50, 100, 250, 500];
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, '...');
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push('...', totalPages);
    } else {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  return (
    <div className="bg-white border-t border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e?.target?.value))}
            className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {itemsPerPageOptions?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {startItem?.toLocaleString()} to {endItem?.toLocaleString()} of {totalItems?.toLocaleString()} results
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            <Icon name="ChevronLeftIcon" size={16} className="text-muted-foreground" />
          </button>

          {visiblePages?.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-muted-foreground">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-micro ${
                    currentPage === page
                      ? 'bg-primary text-white' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-micro"
          >
            <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

TransactionPagination.propTypes = {
  currentPage: PropTypes?.number?.isRequired,
  totalPages: PropTypes?.number?.isRequired,
  totalItems: PropTypes?.number?.isRequired,
  itemsPerPage: PropTypes?.number?.isRequired,
  onPageChange: PropTypes?.func?.isRequired,
  onItemsPerPageChange: PropTypes?.func?.isRequired
};

export default TransactionPagination;