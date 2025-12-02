import React from 'react';
import NotificationsCenterInteractive from './components/NotificationsCenterInteractive';

export const metadata = {
  title: 'Notifications Center - LF Parking Management System',
  description: 'Monitor and respond to real-time system alerts and operational notifications across all parking locations and functions.'
};

export default function NotificationsCenterPage() {
  const mockNotifications = [
    {
      id: "notif_001",
      type: "car_validation",
      title: "Unauthorized Vehicle Detected",
      message: "Vehicle ABC 123 detected in VIP section without valid permit. Immediate action required.",
      urgency: "critical",
      location: "Pacs",
      licensePlate: "ABC 123",
      timestamp: "2025-11-18T21:30:00Z",
      status: "pending"
    },
    {
      id: "notif_002",
      type: "price_change",
      title: "Dynamic Pricing Update",
      message: "Hourly rate increased to $8.50 due to high occupancy (92%). Surge pricing activated.",
      urgency: "high",
      location: "54 Flagler",
      timestamp: "2025-11-18T21:25:00Z",
      status: "pending"
    },
    {
      id: "notif_003",
      type: "new_booking",
      title: "VIP Reservation Confirmed",
      message: "New VIP booking for premium spot #A-15. Customer arriving in 30 minutes.",
      urgency: "medium",
      location: "18 Lincoln",
      bookingRef: "BK-789012",
      timestamp: "2025-11-18T21:20:00Z",
      status: "accepted"
    },
    {
      id: "notif_004",
      type: "ticket_dismissal",
      title: "Violation Ticket Dismissed",
      message: "Parking violation VIO-2024-001234 has been dismissed by enforcement officer.",
      urgency: "low",
      location: "11 ST",
      licensePlate: "XYZ 789",
      timestamp: "2025-11-18T21:15:00Z",
      status: "closed"
    },
    {
      id: "notif_005",
      type: "car_validation",
      title: "Expired Permit Alert",
      message: "Monthly permit for DEF 456 expired yesterday. Vehicle still parked in reserved spot.",
      urgency: "high",
      location: "72 Park",
      licensePlate: "DEF 456",
      timestamp: "2025-11-18T21:10:00Z",
      status: "pending"
    },
    {
      id: "notif_006",
      type: "price_change",
      title: "Event Pricing Activated",
      message: "Special event pricing now active. Rates adjusted for concert at nearby venue.",
      urgency: "medium",
      location: "Pacs",
      timestamp: "2025-11-18T21:05:00Z",
      status: "accepted"
    },
    {
      id: "notif_007",
      type: "new_booking",
      title: "Employee Permit Renewal",
      message: "Employee permit EMP-456789 has been renewed for another year.",
      urgency: "low",
      location: "Pacs",
      bookingRef: "EMP-456789",
      timestamp: "2025-11-18T21:00:00Z",
      status: "accepted"
    },
    {
      id: "notif_008",
      type: "car_validation",
      title: "Multiple Violations Detected",
      message: "Vehicle GHI 321 has accumulated 3 violations this week. Consider towing action.",
      urgency: "critical",
      location: "54 Flagler",
      licensePlate: "GHI 321",
      timestamp: "2025-11-18T20:55:00Z",
      status: "pending"
    },
    {
      id: "notif_009",
      type: "ticket_dismissal",
      title: "Payment Received",
      message: "Outstanding violation ticket VIO-2024-001235 has been paid in full.",
      urgency: "low",
      location: "18 Lincoln",
      licensePlate: "JKL 654",
      timestamp: "2025-11-18T20:50:00Z",
      status: "closed"
    },
    {
      id: "notif_010",
      type: "new_booking",
      title: "Bulk Reservation Alert",
      message: "Corporate client has reserved 15 spots for tomorrow\'s board meeting.",
      urgency: "medium",
      location: "11 ST",
      bookingRef: "CORP-2024-15",
      timestamp: "2025-11-18T20:45:00Z",
      status: "pending"
    }
  ];

  const mockStats = {
    total: mockNotifications?.length,
    pending: mockNotifications?.filter(n => n?.status === 'pending')?.length,
    critical: mockNotifications?.filter(n => n?.urgency === 'critical')?.length,
    resolved: mockNotifications?.filter(n => n?.status === 'accepted' || n?.status === 'closed')?.length
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Notifications Center</h1>
                  <p className="text-muted-foreground mt-1">
                    Monitor and respond to real-time system alerts and operational notifications
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>Live Updates Active</span>
                </div>
              </div>
            </div>

            {/* Interactive Content */}
            <NotificationsCenterInteractive 
              initialNotifications={mockNotifications}
              initialStats={mockStats}
            />
      </div>
    </div>
  );
}