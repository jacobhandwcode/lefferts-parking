'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceTable from './MaintenanceTable';
import DateRangePicker from '@/app/dashboard-overview/components/DateRangePicker';
import Icon from '@/components/ui/AppIcon';

const MaintenanceLogInteractive = ({ initialData }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '2026-01-01',
    endDate: '2026-01-01'
  });
  
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: 'MNT001',
      date: '2026-01-15',
      lot: 'Pacs',
      openBy: 'John Martinez',
      status: 'Open',
      description: 'Parking gate sensor malfunction - requires recalibration',
      priority: 'High',
      category: 'Electrical',
      estimatedTime: '2 hours',
      assignedTo: 'Sarah Chen',
      createdAt: '2026-01-15T08:30:00Z'
    },
    {
      id: 'MNT002',
      date: '2026-01-14',
      lot: '11 ST',
      openBy: 'Mike Thompson',
      status: 'In Progress',
      description: 'LED lighting replacement in section A - 12 units',
      priority: 'Medium',
      category: 'Lighting',
      estimatedTime: '4 hours',
      assignedTo: 'Lisa Rodriguez',
      createdAt: '2026-01-14T14:15:00Z'
    },
    {
      id: 'MNT003',
      date: '2026-01-13',
      lot: '54 Flagler',
      openBy: 'Sarah Chen',
      status: 'Closed',
      description: 'Routine cleaning of payment kiosks and screen calibration',
      priority: 'Low',
      category: 'Maintenance',
      estimatedTime: '1 hour',
      assignedTo: 'John Martinez',
      createdAt: '2026-01-13T10:45:00Z'
    },
    {
      id: 'MNT004',
      date: '2026-01-12',
      lot: '18 Lincoln',
      openBy: 'Lisa Rodriguez',
      status: 'Open',
      description: 'Security camera #3 showing distorted image - lens cleaning required',
      priority: 'Medium',
      category: 'Security',
      estimatedTime: '30 minutes',
      assignedTo: 'Mike Thompson',
      createdAt: '2026-01-12T16:20:00Z'
    },
    {
      id: 'MNT005',
      date: '2026-01-11',
      lot: '72 Park',
      openBy: 'John Martinez',
      status: 'Closed',
      description: 'Monthly inspection of fire safety equipment - all clear',
      priority: 'High',
      category: 'Safety',
      estimatedTime: '2 hours',
      assignedTo: 'Sarah Chen',
      createdAt: '2026-01-11T09:00:00Z'
    }
  ]);

  const handleNewMaintenance = (maintenanceData) => {
    const newRecord = {
      id: `MNT${String(maintenanceRecords?.length + 1)?.padStart(3, '0')}`,
      ...maintenanceData,
      createdAt: new Date()?.toISOString()
    };
    
    setMaintenanceRecords(prev => [newRecord, ...prev]);
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Lot', 'Open By', 'Status', 'Description', 'Priority', 'Category', 'Assigned To'],
      ...maintenanceRecords?.map(record => [
        record?.date,
        record?.lot,
        record?.openBy,
        record?.status,
        record?.description,
        record?.priority,
        record?.category,
        record?.assignedTo
      ])
    ];

    const csvString = csvContent?.map(row => 
      row?.map(field => `"${field}"`).join(',')
    )?.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document?.createElement('a');
    const url = URL?.createObjectURL(blob);
    link?.setAttribute('href', url);
    link?.setAttribute('download', `maintenance_log_${dateRange?.startDate}_to_${dateRange?.endDate}.csv`);
    link.style.visibility = 'hidden';
    document?.body?.appendChild(link);
    link?.click();
    document?.body?.removeChild(link);
  };

  const filteredRecords = maintenanceRecords?.filter(record => {
    const recordDate = new Date(record?.date);
    const startDate = new Date(dateRange?.startDate);
    const endDate = new Date(dateRange?.endDate);
    return recordDate >= startDate && recordDate <= endDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-all duration-200 ${
        sidebarCollapsed ? 'ml-16' : 'ml-72'
      } pt-16`}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Maintenance Log</h1>
              <p className="text-muted-foreground">
                Track and manage maintenance activities across all parking facilities
              </p>
            </div>
          </div>

          {/* Maintenance Form */}
          <MaintenanceForm 
            onSubmit={handleNewMaintenance}
            locations={initialData?.locations}
            operators={initialData?.operators}
          />

          {/* Log Section */}
          <div className="bg-white rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-medium text-foreground">Maintenance Records</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Time Period:</span>
                    <DateRangePicker
                      startDate={dateRange?.startDate}
                      endDate={dateRange?.endDate}
                      onDateRangeChange={handleDateRangeChange}
                    />
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-micro"
                >
                  <Icon name="ArrowDownTrayIcon" size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <MaintenanceTable records={filteredRecords} />
          </div>
        </div>
      </main>
    </div>
  );
};

MaintenanceLogInteractive.propTypes = {
  initialData: PropTypes.object.isRequired
};

export default MaintenanceLogInteractive;