'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TimeFrameSelector from './TimeFrameSelector';
import DateRangePicker from './DateRangePicker';
import KPICard from './KPICard';
import LicensePlateSearch from './LicensePlateSearch';

const DashboardInteractive = ({ initialData }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('today');
  const [startDate, setStartDate] = useState(new Date(2024, 10, 18)); // November 18, 2024
  const [endDate, setEndDate] = useState(new Date(2024, 10, 18));
  const [kpiData, setKpiData] = useState(initialData?.kpiData);
  const [searchResults, setSearchResults] = useState([]);

  // Mock KPI data for different time frames
  const mockKpiData = {
    today: {
      entryCount: { value: '1,247', trend: 'up', trendValue: '+12%' },
      bookings: { value: '892', trend: 'up', trendValue: '+8%' },
      revenue: { value: '$18,450', trend: 'up', trendValue: '+15%' },
      occupancy: { value: '78%', trend: 'neutral', trendValue: '0%' },
      authorized: { value: '1,156', trend: 'up', trendValue: '+5%' },
      unauthorized: { value: '91', trend: 'down', trendValue: '-3%' },
      currentOccupancy: { value: '456/585', trend: 'up', trendValue: '+2%' }
    },
    wtd: {
      entryCount: { value: '8,734', trend: 'up', trendValue: '+18%' },
      bookings: { value: '6,245', trend: 'up', trendValue: '+12%' },
      revenue: { value: '$129,150', trend: 'up', trendValue: '+22%' },
      occupancy: { value: '82%', trend: 'up', trendValue: '+4%' },
      authorized: { value: '8,092', trend: 'up', trendValue: '+8%' },
      unauthorized: { value: '642', trend: 'down', trendValue: '-5%' },
      currentOccupancy: { value: '456/585', trend: 'up', trendValue: '+2%' }
    },
    mtd: {
      entryCount: { value: '34,567', trend: 'up', trendValue: '+25%' },
      bookings: { value: '24,890', trend: 'up', trendValue: '+20%' },
      revenue: { value: '$512,340', trend: 'up', trendValue: '+28%' },
      occupancy: { value: '85%', trend: 'up', trendValue: '+7%' },
      authorized: { value: '32,145', trend: 'up', trendValue: '+12%' },
      unauthorized: { value: '2,422', trend: 'down', trendValue: '-8%' },
      currentOccupancy: { value: '456/585', trend: 'up', trendValue: '+2%' }
    },
    ytd: {
      entryCount: { value: '412,890', trend: 'up', trendValue: '+32%' },
      bookings: { value: '298,567', trend: 'up', trendValue: '+28%' },
      revenue: { value: '$6,145,780', trend: 'up', trendValue: '+35%' },
      occupancy: { value: '87%', trend: 'up', trendValue: '+10%' },
      authorized: { value: '385,234', trend: 'up', trendValue: '+15%' },
      unauthorized: { value: '27,656', trend: 'down', trendValue: '-12%' },
      currentOccupancy: { value: '456/585', trend: 'up', trendValue: '+2%' }
    }
  };

  // Mock search results
  const mockSearchResults = [
    { id: 1, plate: 'ABC 123', timestamp: '2:45 PM', status: 'authorized' },
    { id: 2, plate: 'XYZ 789', timestamp: '2:42 PM', status: 'unauthorized' },
    { id: 3, plate: 'DEF 456', timestamp: '2:38 PM', status: 'authorized' },
    { id: 4, plate: 'GHI 012', timestamp: '2:35 PM', status: 'pending' },
    { id: 5, plate: 'JKL 345', timestamp: '2:32 PM', status: 'authorized' },
    { id: 6, plate: 'MNO 678', timestamp: '2:28 PM', status: 'authorized' },
    { id: 7, plate: 'PQR 901', timestamp: '2:25 PM', status: 'unauthorized' },
    { id: 8, plate: 'STU 234', timestamp: '2:22 PM', status: 'authorized' },
    { id: 9, plate: 'VWX 567', timestamp: '2:18 PM', status: 'authorized' },
    { id: 10, plate: 'YZA 890', timestamp: '2:15 PM', status: 'pending' },
    { id: 11, plate: 'BCD 123', timestamp: '2:12 PM', status: 'authorized' },
    { id: 12, plate: 'EFG 456', timestamp: '2:08 PM', status: 'authorized' },
    { id: 13, plate: 'HIJ 789', timestamp: '2:05 PM', status: 'unauthorized' },
    { id: 14, plate: 'KLM 012', timestamp: '2:02 PM', status: 'authorized' }
  ];

  useEffect(() => {
    // Update KPI data when time frame changes
    setKpiData(mockKpiData?.[selectedTimeFrame]);
  }, [selectedTimeFrame]);

  useEffect(() => {
    // Update date range based on selected time frame
    const today = new Date(2024, 10, 18); // November 18, 2024
    
    switch (selectedTimeFrame) {
      case 'today':
        setStartDate(today);
        setEndDate(today);
        break;
      case 'wtd':
        const startOfWeek = new Date(today);
        startOfWeek?.setDate(today?.getDate() - today?.getDay());
        setStartDate(startOfWeek);
        setEndDate(today);
        break;
      case 'mtd':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(startOfMonth);
        setEndDate(today);
        break;
      case 'ytd':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        setStartDate(startOfYear);
        setEndDate(today);
        break;
      default:
        break;
    }
  }, [selectedTimeFrame]);

  const handleTimeFrameChange = (timeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };

  const handleSearch = async (query) => {
    if (query) {
      // Filter results based on query
      const filtered = mockSearchResults?.filter(result =>
        result?.plate?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockSearchResults);
    }
  };

  // Initialize search results on component mount
  useEffect(() => {
    setSearchResults(mockSearchResults);
  }, []);

  const kpiCards = [
    {
      title: 'Entry Count',
      value: kpiData?.entryCount?.value,
      trend: kpiData?.entryCount?.trend,
      trendValue: kpiData?.entryCount?.trendValue,
      icon: 'ArrowRightOnRectangleIcon',
      color: 'primary'
    },
    {
      title: 'Bookings',
      value: kpiData?.bookings?.value,
      trend: kpiData?.bookings?.trend,
      trendValue: kpiData?.bookings?.trendValue,
      icon: 'CalendarIcon',
      color: 'success'
    },
    {
      title: 'Revenue',
      value: kpiData?.revenue?.value,
      trend: kpiData?.revenue?.trend,
      trendValue: kpiData?.revenue?.trendValue,
      icon: 'CurrencyDollarIcon',
      color: 'success'
    },
    {
      title: 'Occupancy Rate',
      value: kpiData?.occupancy?.value,
      trend: kpiData?.occupancy?.trend,
      trendValue: kpiData?.occupancy?.trendValue,
      icon: 'ChartBarIcon',
      color: 'warning'
    },
    {
      title: 'Authorized Vehicles',
      value: kpiData?.authorized?.value,
      trend: kpiData?.authorized?.trend,
      trendValue: kpiData?.authorized?.trendValue,
      icon: 'CheckCircleIcon',
      color: 'success'
    },
    {
      title: 'Unauthorized Count',
      value: kpiData?.unauthorized?.value,
      trend: kpiData?.unauthorized?.trend,
      trendValue: kpiData?.unauthorized?.trendValue,
      icon: 'ExclamationTriangleIcon',
      color: 'error'
    },
    {
      title: 'Current Occupancy',
      value: kpiData?.currentOccupancy?.value,
      trend: kpiData?.currentOccupancy?.trend,
      trendValue: kpiData?.currentOccupancy?.trendValue,
      icon: 'BuildingOfficeIcon',
      color: 'primary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="bg-white border border-border rounded-lg p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <TimeFrameSelector
            selectedTimeFrame={selectedTimeFrame}
            onTimeFrameChange={handleTimeFrameChange}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpiCards?.map((card, index) => (
          <KPICard
            key={index}
            title={card?.title}
            value={card?.value}
            trend={card?.trend}
            trendValue={card?.trendValue}
            icon={card?.icon}
            color={card?.color}
          />
        ))}
      </div>
      {/* License Plate Search */}
      <LicensePlateSearch
        onSearch={handleSearch}
        searchResults={searchResults}
      />
    </div>
  );
};

DashboardInteractive.propTypes = {
  initialData: PropTypes?.shape({
    kpiData: PropTypes?.object?.isRequired
  })?.isRequired
};

export default DashboardInteractive;