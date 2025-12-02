import AllLotSummaryInteractive from './components/AllLotSummaryInteractive';

export const metadata = {
  title: 'Analytics - All Lot Summary - LF Parking Management System',
  description: 'Comparative performance analysis across all parking locations through individual lot metric buttons and consolidated reporting.',
};

export default function AllLotSummaryPage() {
  // Mock parking lot data
  const parkingLots = [
    {
      id: 'pacs',
      name: 'Pacs',
      metrics: {
        totalRevenue: 45680,
        revenue: 42340,
        bookings: 892,
        enforcementRevenue: 3340,
        ticketsPaid: 34,
        ticketIssued: 47
      }
    },
    {
      id: '11st',
      name: '11th ST',
      metrics: {
        totalRevenue: 38920,
        revenue: 36120,
        bookings: 734,
        enforcementRevenue: 2800,
        ticketsPaid: 28,
        ticketIssued: 39
      }
    },
    {
      id: '54flagler',
      name: '54 Flagler',
      metrics: {
        totalRevenue: 52340,
        revenue: 48900,
        bookings: 967,
        enforcementRevenue: 3440,
        ticketsPaid: 41,
        ticketIssued: 52
      }
    },
    {
      id: '72park',
      name: '72 Park',
      metrics: {
        totalRevenue: 36780,
        revenue: 34200,
        bookings: 683,
        enforcementRevenue: 2580,
        ticketsPaid: 26,
        ticketIssued: 35
      }
    },
    {
      id: '18lincoln',
      name: '18 Lincoln',
      metrics: {
        totalRevenue: 41250,
        revenue: 38470,
        bookings: 756,
        enforcementRevenue: 2780,
        ticketsPaid: 31,
        ticketIssued: 41
      }
    }
  ];

  // Calculate totals
  const totals = parkingLots?.reduce((acc, lot) => ({
    totalRevenue: acc?.totalRevenue + lot?.metrics?.totalRevenue,
    revenue: acc?.revenue + lot?.metrics?.revenue,
    bookings: acc?.bookings + lot?.metrics?.bookings,
    enforcementRevenue: acc?.enforcementRevenue + lot?.metrics?.enforcementRevenue,
    ticketsPaid: acc?.ticketsPaid + lot?.metrics?.ticketsPaid,
    ticketIssued: acc?.ticketIssued + lot?.metrics?.ticketIssued
  }), {
    totalRevenue: 0,
    revenue: 0,
    bookings: 0,
    enforcementRevenue: 0,
    ticketsPaid: 0,
    ticketIssued: 0
  });

  const initialData = {
    timeRange: {
      start: '2026-01-01',
      end: '2026-01-01'
    },
    parkingLots,
    totals
  };

  return (
    <AllLotSummaryInteractive
      initialData={initialData}
    />
  );
}