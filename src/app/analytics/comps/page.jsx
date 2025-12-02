import CompsAnalyticsInteractive from './components/CompsAnalyticsInteractive';

export const metadata = {
  title: 'Analytics - COMPS - LF Parking Management System',
  description: 'Competitive analysis through side-by-side visual mapping and data comparison tools for strategic market positioning.',
};

export default function AnalyticsCompsPage() {
  // Mock competitor data for COMPS table
  const compsData = [
    {
      id: 1,
      parkingLot: 'Downtown Plaza Parking',
      address: '123 Main St, Miami, FL 33101',
      pricePerHr: 4.50,
      occupancyRate: 87.5,
      lat: 25.7617,
      lng: -80.1918
    },
    {
      id: 2,
      parkingLot: 'Bayfront Park Garage',
      address: '301 Biscayne Blvd, Miami, FL 33132',
      pricePerHr: 5.25,
      occupancyRate: 92.3,
      lat: 25.7753,
      lng: -80.1861
    },
    {
      id: 3,
      parkingLot: 'Flagler Street Lot',
      address: '45 W Flagler St, Miami, FL 33130',
      pricePerHr: 3.75,
      occupancyRate: 78.9,
      lat: 25.7743,
      lng: -80.1937
    },
    {
      id: 4,
      parkingLot: 'Lincoln Road Parking',
      address: '420 Lincoln Rd, Miami Beach, FL 33139',
      pricePerHr: 6.00,
      occupancyRate: 95.1,
      lat: 25.7906,
      lng: -80.1340
    },
    {
      id: 5,
      parkingLot: 'Midtown Miami Garage',
      address: '3401 N Miami Ave, Miami, FL 33127',
      pricePerHr: 4.25,
      occupancyRate: 83.7,
      lat: 25.8067,
      lng: -80.1955
    }
  ];

  // Mock updates data for Updates table
  const updatesData = [
    {
      id: 1,
      parkingLot: 'Downtown Plaza Parking',
      event: 'Price Increase',
      date: '2024-11-15',
      time: '09:00 AM',
      lat: 25.7617,
      lng: -80.1918
    },
    {
      id: 2,
      parkingLot: 'Bayfront Park Garage',
      event: 'New Technology Implementation',
      date: '2024-11-12',
      time: '02:30 PM',
      lat: 25.7753,
      lng: -80.1861
    },
    {
      id: 3,
      parkingLot: 'Lincoln Road Parking',
      event: 'Capacity Expansion',
      date: '2024-11-10',
      time: '11:15 AM',
      lat: 25.7906,
      lng: -80.1340
    },
    {
      id: 4,
      parkingLot: 'Flagler Street Lot',
      event: 'Maintenance Closure',
      date: '2024-11-08',
      time: '06:00 AM',
      lat: 25.7743,
      lng: -80.1937
    },
    {
      id: 5,
      parkingLot: 'Midtown Miami Garage',
      event: 'Security Upgrade',
      date: '2024-11-05',
      time: '08:45 PM',
      lat: 25.8067,
      lng: -80.1955
    }
  ];

  // Mock map configuration
  const mapConfig = {
    center: {
      lat: 25.7617,
      lng: -80.1918
    },
    zoom: 12,
    mapType: 'roadmap'
  };

  return (
    <CompsAnalyticsInteractive
      compsData={compsData}
      updatesData={updatesData}
      mapConfig={mapConfig}
    />
  );
}