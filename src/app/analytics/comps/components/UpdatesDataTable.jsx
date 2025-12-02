'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/AppIcon';

const UpdatesDataTable = ({ data, selectedItem, onItemSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    let filteredData = data?.filter(item => {
      const matchesSearch = item?.parkingLot?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           item?.event?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesEvent = eventFilter === 'all' || 
                          item?.event?.toLowerCase()?.includes(eventFilter?.toLowerCase());
      
      return matchesSearch && matchesEvent;
    });

    if (sortConfig?.key) {
      filteredData?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key];
        const bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'date') {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return sortConfig?.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }

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

  const getEventIcon = (event) => {
    const eventType = event?.toLowerCase();
    if (eventType?.includes('price')) return 'CurrencyDollarIcon';
    if (eventType?.includes('expansion') || eventType?.includes('capacity')) return 'ArrowTrendingUpIcon';
    if (eventType?.includes('technology') || eventType?.includes('upgrade')) return 'CogIcon';
    if (eventType?.includes('closure') || eventType?.includes('maintenance')) return 'ExclamationTriangleIcon';
    if (eventType?.includes('security')) return 'ShieldCheckIcon';
    return 'InformationCircleIcon';
  };

  const getEventColor = (event) => {
    const eventType = event?.toLowerCase();
    if (eventType?.includes('price')) return 'text-red-600 bg-red-50';
    if (eventType?.includes('expansion') || eventType?.includes('upgrade')) return 'text-blue-600 bg-blue-50';
    if (eventType?.includes('closure') || eventType?.includes('maintenance')) return 'text-orange-600 bg-orange-50';
    if (eventType?.includes('security')) return 'text-green-600 bg-green-50';
    return 'text-purple-600 bg-purple-50';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parking lots or events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-foreground">Filter by Event:</label>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Events</option>
            <option value="price">Price Changes</option>
            <option value="expansion">Expansions</option>
            <option value="technology">Technology</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
          </select>
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
                  onClick={() => handleSort('event')}
                  className="flex items-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span>Event</span>
                  <SortIcon column="event" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center justify-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors w-full"
                >
                  <span>Date</span>
                  <SortIcon column="date" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('time')}
                  className="flex items-center justify-center space-x-1 font-semibold text-sm text-foreground hover:text-primary transition-colors w-full"
                >
                  <span>Time</span>
                  <SortIcon column="time" />
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
                    <div className="w-3 h-3 bg-secondary rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{item?.parkingLot}</div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Icon name="MapPinIcon" size={12} />
                        <span>View on map</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getEventColor(item?.event)}`}>
                    <Icon name={getEventIcon(item?.event)} size={14} />
                    <span>{item?.event}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="font-medium text-sm text-foreground">{formatDate(item?.date)}</div>
                  <div className="text-xs text-muted-foreground">
                    {getDaysAgo(item?.date)} days ago
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="font-medium text-sm text-foreground">{item?.time}</div>
                  <div className="text-xs text-muted-foreground">local time</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedData?.length} of {data?.length} recent updates</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Most Recent:</span>
              <span className="font-semibold text-foreground">
                {formatDate(Math.max(...data?.map(item => new Date(item?.date))))}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Total Events:</span>
              <span className="font-semibold text-foreground">{data?.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdatesDataTable.propTypes = {
  data: PropTypes?.arrayOf(PropTypes?.shape({
    id: PropTypes?.number?.isRequired,
    parkingLot: PropTypes?.string?.isRequired,
    event: PropTypes?.string?.isRequired,
    date: PropTypes?.string?.isRequired,
    time: PropTypes?.string?.isRequired
  }))?.isRequired,
  selectedItem: PropTypes?.object,
  onItemSelect: PropTypes?.func
};

export default UpdatesDataTable;