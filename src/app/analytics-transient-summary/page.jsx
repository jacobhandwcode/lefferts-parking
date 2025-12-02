import TransientSummaryInteractive from './components/TransientSummaryInteractive';

export const metadata = {
  title: 'Analytics - Transient Summary - LF Parking Management System',
  description: 'Comprehensive transient parking performance analysis through three distinct metric sections for operational and financial oversight.',
};

export default function TransientSummaryPage() {
  // Mock initial data
  const initialData = {
    timeRange: {
      start: '2026-01-01',
      end: '2026-01-01'
    },
    overallMetrics: {
      totalRevenue: 124580,
      totalSurcharge: 8920,
      totalSalesTax: 9966,
      totalNetRevenue: 105694
    },
    transientMetrics: {
      revenue: 98750,
      surcharge: 7280,
      salesTax: 7900,
      netRevenue: 83570,
      bookings: 1847
    },
    enforcementMetrics: {
      revenue: 25830,
      surcharge: 1640,
      salesTax: 2066,
      netRevenue: 22124,
      violationsSent: 234,
      violationsPaid: 189
    }
  };

  return (
    <TransientSummaryInteractive
      initialData={initialData}
    />
  );
}