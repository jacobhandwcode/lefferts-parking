import FinancialAnalyticsInteractive from './components/FinancialAnalyticsInteractive';

export const metadata = {
  title: 'Financial Analytics - LF Parking Management System',
  description: 'Comprehensive revenue analysis and financial performance insights across all parking locations with interactive charts and trend analysis.',
};

export default function FinancialAnalyticsPage() {
  // Mock initial filters
  const initialFilters = {
    timeframe: 'mtd',
    selectedLocation: 'all',
    revenueCategory: 'all',
    comparisonTimeframe: 'previous_month',
    dateRange: {
      startDate: '2024-11-01',
      endDate: '2024-11-18'
    }
  };

  // Mock heat map data
  const heatMapData = [
    {
      id: 'pacs',
      name: 'Pacs',
      totalRevenue: 45680,
      timeData: [
        { period: 'Week 1', revenue: 12450, transactions: 234 },
        { period: 'Week 2', revenue: 11890, transactions: 221 },
        { period: 'Week 3', revenue: 13240, transactions: 267 },
        { period: 'Week 4', revenue: 8100, transactions: 156 },
        { period: 'Mon', revenue: 2340, transactions: 45 },
        { period: 'Tue', revenue: 2890, transactions: 52 },
        { period: 'Wed', revenue: 3120, transactions: 58 }
      ]
    },
    {
      id: '11st',
      name: '11 ST',
      totalRevenue: 38920,
      timeData: [
        { period: 'Week 1', revenue: 10230, transactions: 198 },
        { period: 'Week 2', revenue: 9870, transactions: 187 },
        { period: 'Week 3', revenue: 11450, transactions: 223 },
        { period: 'Week 4', revenue: 7370, transactions: 142 },
        { period: 'Mon', revenue: 1980, transactions: 38 },
        { period: 'Tue', revenue: 2340, transactions: 44 },
        { period: 'Wed', revenue: 2560, transactions: 49 }
      ]
    },
    {
      id: '54flagler',
      name: '54 Flagler',
      totalRevenue: 52340,
      timeData: [
        { period: 'Week 1', revenue: 14560, transactions: 289 },
        { period: 'Week 2', revenue: 13890, transactions: 276 },
        { period: 'Week 3', revenue: 15120, transactions: 301 },
        { period: 'Week 4', revenue: 8770, transactions: 174 },
        { period: 'Mon', revenue: 2890, transactions: 57 },
        { period: 'Tue', revenue: 3240, transactions: 64 },
        { period: 'Wed', revenue: 3450, transactions: 68 }
      ]
    },
    {
      id: '18lincoln',
      name: '18 Lincoln',
      totalRevenue: 41250,
      timeData: [
        { period: 'Week 1', revenue: 11340, transactions: 212 },
        { period: 'Week 2', revenue: 10890, transactions: 203 },
        { period: 'Week 3', revenue: 12450, transactions: 234 },
        { period: 'Week 4', revenue: 6570, transactions: 123 },
        { period: 'Mon', revenue: 2120, transactions: 40 },
        { period: 'Tue', revenue: 2450, transactions: 46 },
        { period: 'Wed', revenue: 2670, transactions: 50 }
      ]
    },
    {
      id: '72park',
      name: '72 Park',
      totalRevenue: 36780,
      timeData: [
        { period: 'Week 1', revenue: 9890, transactions: 178 },
        { period: 'Week 2', revenue: 9340, transactions: 168 },
        { period: 'Week 3', revenue: 10670, transactions: 192 },
        { period: 'Week 4', revenue: 6880, transactions: 124 },
        { period: 'Mon', revenue: 1890, transactions: 34 },
        { period: 'Tue', revenue: 2230, transactions: 40 },
        { period: 'Wed', revenue: 2340, transactions: 42 }
      ]
    }
  ];

  // Mock chart data
  const chartData = [
    { name: 'Pacs', revenue: 45680, transactions: 878, occupancy: 87 },
    { name: '11 ST', revenue: 38920, transactions: 750, occupancy: 82 },
    { name: '54 Flagler', revenue: 52340, transactions: 1040, occupancy: 91 },
    { name: '18 Lincoln', revenue: 41250, transactions: 793, occupancy: 85 },
    { name: '72 Park', revenue: 36780, transactions: 708, occupancy: 79 }
  ];

  // Mock trend data
  const trendData = [
    { period: 'This Month', revenue: 214970, growth: 12.5 },
    { period: 'Last Month', revenue: 191240, growth: 8.3 },
    { period: '2 Months Ago', revenue: 176580, growth: -2.1 },
    { period: '3 Months Ago', revenue: 180360, growth: 15.7 }
  ];

  // Mock benchmark data
  const benchmarkData = [
    { metric: 'Monthly Revenue Target', actual: 214970, target: 200000, type: 'currency' },
    { metric: 'Occupancy Rate', actual: 84.8, target: 85.0, type: 'percentage' },
    { metric: 'Revenue per Transaction', actual: 57.32, target: 55.00, type: 'currency' },
    { metric: 'Customer Satisfaction', actual: 92.5, target: 90.0, type: 'percentage' }
  ];

  return (
    <FinancialAnalyticsInteractive
      initialFilters={initialFilters}
      heatMapData={heatMapData}
      chartData={chartData}
      trendData={trendData}
      benchmarkData={benchmarkData}
    />
  );
}