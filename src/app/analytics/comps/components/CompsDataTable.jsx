'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const CompsDataTable = ({ data, selectedItem, onItemSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    let filteredData = data?.filter(item =>
      item?.parkingLot?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    if (sortConfig?.key) {
      filteredData?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];

        if (typeof aValue === 'string') {
          return sortConfig?.direction === 'asc' 
            ? aValue?.localeCompare(bValue)
            : bValue?.localeCompare(aValue);
        }
        
        if (sortConfig?.direction === 'asc') {
          return aValue - bValue;
        }
        return bValue - aValue;
      });
    }

    return filteredData;
  };

  const sortedData = getSortedData();

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ChevronUpDownIcon" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ChevronUpIcon" size={14} className="text-primary" />
      : <Icon name="ChevronDownIcon" size={14} className="text-primary" />;
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'text-red-600 bg-red-50';
    if (rate >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPriceColor = (price) => {
    if (price >= 5.50) return 'text-red-600 font-semibold';
    if (price >= 4.00) return 'text-yellow-600 font-medium';
    return 'text-green-600 font-medium';
  };

  return (
    <div className="overflow-hidden">
      {/* Search and Filter */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parking lots or addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('parkingLot')}
                  className="flex items-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span>Parking Lot</span>
                  <SortIcon column="parkingLot" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('address')}
                  className="flex items-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span>Address</span>
                  <SortIcon column="address" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('pricePerHr')}
                  className="flex items-center justify-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors w-full"
                >
                  <span>Price per Hr</span>
                  <SortIcon column="pricePerHr" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('occupancyRate')}
                  className="flex items-center justify-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors w-full"
                >
                  <span>Occupancy Rate</span>
                  <SortIcon column="occupancyRate" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData?.map((item) => (
              <tr
                key={item?.id}
                onClick={() => onItemSelect?.(item)}
                className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedItem?.id === item?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{item?.parkingLot}</div>
                      <div className="text-xs text-muted-foreground">Competitor Facility</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{item?.address}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    <Icon name="MapPinIcon" size={12} />
                    <span>View on map</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className={`text-lg font-bold ${getPriceColor(item?.pricePerHr)}`}>
                    ${item?.pricePerHr?.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">per hour</div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getOccupancyColor(item?.occupancyRate)}`}>
                    {item?.occupancyRate?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">average</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedData?.length} of {data?.length} competitors</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Avg Price:</span>
              <span className="font-semibold text-foreground">
                ${(data?.reduce((sum, item) => sum + item?.pricePerHr, 0) / data?.length)?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Avg Occupancy:</span>
              <span className="font-semibold text-foreground">
                {(data?.reduce((sum, item) => sum + item?.occupancyRate, 0) / data?.length)?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CompsDataTable.propTypes = {
  data: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    parkingLot: PropTypes?.string?.isRequired,
    address: PropTypes?.string?.isRequired,
    pricePerHr: PropTypes?.number?.isRequired,
    occupancyRate: PropTypes?.number?.isRequired
  }))?.isRequired,
  selectedItem: PropTypes?.object,
  onItemSelect: PropTypes?.func
};

export default CompsDataTable;