import React from 'react';
import EnforcementReportsInteractive from './components/EnforcementReportsInteractive';

export const metadata = {
  title: 'Enforcement Reports - LF Parking Management System',
  description: 'Track and manage parking violation tickets across all locations with comprehensive reporting and analytics.'
};

export default function EnforcementReportsPage() {
  const mockTickets = [
    {
      id: "1",
      ticketId: "ENF-2024-001234",
      licensePlate: "ABC 123",
      violationType: "Expired Meter",
      location: "Pacs",
      issueDate: "2024-11-18",
      issueTime: "10:30 AM",
      amount: 25.00,
      status: "issued",
      officer: "Officer Johnson",
      notes: "Vehicle parked 2 hours past meter expiration"
    },
    {
      id: "2",
      ticketId: "ENF-2024-001235",
      licensePlate: "XYZ 789",
      violationType: "No Permit",
      location: "11 ST",
      issueDate: "2024-11-18",
      issueTime: "09:15 AM",
      amount: 50.00,
      status: "paid",
      officer: "Officer Smith",
      notes: "No valid permit displayed in employee parking zone"
    },
    {
      id: "3",
      ticketId: "ENF-2024-001236",
      licensePlate: "DEF 456",
      violationType: "Handicap Violation",
      location: "18 Lincoln",
      issueDate: "2024-11-17",
      issueTime: "02:45 PM",
      amount: 100.00,
      status: "overdue",
      officer: "Officer Davis",
      notes: "Parked in handicap space without proper placard"
    },
    {
      id: "4",
      ticketId: "ENF-2024-001237",
      licensePlate: "GHI 321",
      violationType: "Fire Lane",
      location: "Pacs",
      issueDate: "2024-11-17",
      issueTime: "11:20 AM",
      amount: 75.00,
      status: "dismissed",
      officer: "Officer Wilson",
      notes: "Vehicle blocking fire lane access - dismissed due to emergency"
    },
    {
      id: "5",
      ticketId: "ENF-2024-001238",
      licensePlate: "JKL 654",
      violationType: "Overtime Parking",
      location: "11 ST",
      issueDate: "2024-11-16",
      issueTime: "03:30 PM",
      amount: 30.00,
      status: "paid",
      officer: "Officer Brown",
      notes: "Exceeded 2-hour parking limit in visitor zone"
    },
    {
      id: "6",
      ticketId: "ENF-2024-001239",
      licensePlate: "MNO 987",
      violationType: "Expired Meter",
      location: "54 Flagler",
      issueDate: "2024-11-16",
      issueTime: "01:15 PM",
      amount: 25.00,
      status: "refunded",
      officer: "Officer Taylor",
      notes: "Meter malfunction confirmed - ticket refunded"
    },
    {
      id: "7",
      ticketId: "ENF-2024-001240",
      licensePlate: "PQR 147",
      violationType: "No Permit",
      location: "Pacs",
      issueDate: "2024-11-15",
      issueTime: "08:45 AM",
      amount: 50.00,
      status: "issued",
      officer: "Officer Johnson",
      notes: "Expired monthly permit - grace period ended"
    },
    {
      id: "8",
      ticketId: "ENF-2024-001241",
      licensePlate: "STU 258",
      violationType: "Handicap Violation",
      location: "72 Park",
      issueDate: "2024-11-15",
      issueTime: "12:00 PM",
      amount: 100.00,
      status: "paid",
      officer: "Officer Martinez",
      notes: "Invalid handicap placard - expired 6 months ago"
    },
    {
      id: "9",
      ticketId: "ENF-2024-001242",
      licensePlate: "VWX 369",
      violationType: "Fire Lane",
      location: "54 Flagler",
      issueDate: "2024-11-14",
      issueTime: "04:20 PM",
      amount: 75.00,
      status: "issued",
      officer: "Officer Clark",
      notes: "Unattended vehicle in designated fire lane"
    },
    {
      id: "10",
      ticketId: "ENF-2024-001243",
      licensePlate: "YZA 741",
      violationType: "Overtime Parking",
      location: "Pacs",
      issueDate: "2024-11-14",
      issueTime: "05:45 PM",
      amount: 30.00,
      status: "dismissed",
      officer: "Officer Rodriguez",
      notes: "Medical emergency exception granted"
    }
  ];

  const mockStats = {
    totalTickets: 280,
    revenueCollected: 8750,
    pendingTickets: 156,
    collectionRate: 68
  };

  const initialData = {
    tickets: mockTickets,
    stats: mockStats
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Enforcement Reports</h1>
                  <p className="text-muted-foreground">Track and manage parking violation tickets across all locations</p>
                </div>
              </div>
            </div>

            {/* Interactive Content */}
            <EnforcementReportsInteractive initialData={initialData} />
      </div>
    </div>
  );
}