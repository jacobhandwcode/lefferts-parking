import React from 'react';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata = {
  title: 'Dashboard Overview - LF Parking Management System',
  description: 'Real-time operational overview and key performance indicators for parking facility management across all locations.'
};

export default function DashboardOverview() {
  const initialData = {
    kpiData: {
      entryCount: { value: '1,247', trend: 'up', trendValue: '+12%' },
      bookings: { value: '892', trend: 'up', trendValue: '+8%' },
      revenue: { value: '$18,450', trend: 'up', trendValue: '+15%' },
      occupancy: { value: '78%', trend: 'neutral', trendValue: '0%' },
      authorized: { value: '1,156', trend: 'up', trendValue: '+5%' },
      unauthorized: { value: '91', trend: 'down', trendValue: '-3%' },
      currentOccupancy: { value: '456/585', trend: 'up', trendValue: '+2%' }
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time operational overview and key performance indicators across all parking locations
          </p>
        </div>

        {/* Interactive Dashboard Content */}
        <DashboardInteractive initialData={initialData} />
      </div>
    </div>
  );
}