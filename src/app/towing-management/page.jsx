import React from 'react';
import TowingInteractive from './components/TowingInteractive';

export const metadata = {
  title: 'Towing Management - LF Parking Management System',
  description: 'Track and coordinate vehicle towing operations with comprehensive status monitoring and documentation across all parking locations.'
};

export default function TowingManagementPage() {
  const mockTowingData = {
    towingRecords: [
      {
        id: "tow-001",
        towingId: "TOW-2024-001234",
        licensePlate: "ABC 123",
        location: "Pacs",
        towCompany: "Metro Towing",
        requestTime: "2024-11-18T14:30:00Z",
        status: "completed",
        cost: 175.00,
        vehicleInfo: "Honda Civic 2018",
        vehicleColor: "Blue",
        vinLast4: "5678",
        violationType: "expired-meter",
        officerBadge: "12345",
        violationNotes: "Vehicle parked in expired meter zone for over 2 hours. Multiple warnings issued.",
        towingFee: 150.00,
        storageFee: 0.00,
        adminFee: 25.00,
        timeline: [
          {
            action: "Towing request submitted",
            timestamp: "2024-11-18T14:30:00Z",
            notes: "Violation identified by Officer 12345"
          },
          {
            action: "Tow truck dispatched",
            timestamp: "2024-11-18T14:45:00Z",
            notes: "Metro Towing unit #MT-204 assigned"
          },
          {
            action: "Vehicle towed successfully",
            timestamp: "2024-11-18T15:15:00Z",
            notes: "Vehicle transported to Metro Towing impound lot"
          }
        ]
      },
      {
        id: "tow-002",
        towingId: "TOW-2024-001235",
        licensePlate: "XYZ 789",
        location: "11 ST",
        towCompany: "City Tow Services",
        requestTime: "2024-11-18T16:20:00Z",
        status: "in-progress",
        cost: 200.00,
        vehicleInfo: "Ford F-150 2020",
        vehicleColor: "Red",
        vinLast4: "9012",
        violationType: "fire-lane",
        officerBadge: "67890",
        violationNotes: "Vehicle blocking fire lane access. Emergency response required immediate removal.",
        towingFee: 175.00,
        storageFee: 0.00,
        adminFee: 25.00,
        timeline: [
          {
            action: "Emergency towing request submitted",
            timestamp: "2024-11-18T16:20:00Z",
            notes: "High priority - blocking emergency access"
          },
          {
            action: "Tow truck dispatched",
            timestamp: "2024-11-18T16:25:00Z",
            notes: "City Tow unit #CT-156 en route"
          },
          {
            action: "Tow truck on scene",
            timestamp: "2024-11-18T16:40:00Z",
            notes: "Beginning vehicle removal process"
          }
        ]
      },
      {
        id: "tow-003",
        towingId: "TOW-2024-001236",
        licensePlate: "DEF 456",
        location: "54 Flagler",
        towCompany: "Rapid Recovery",
        requestTime: "2024-11-18T13:15:00Z",
        status: "dispatched",
        cost: 150.00,
        vehicleInfo: "Toyota Camry 2019",
        vehicleColor: "White",
        vinLast4: "3456",
        violationType: "no-permit",
        officerBadge: "11111",
        violationNotes: "Vehicle parked in permit-only zone without valid monthly or employee permit displayed.",
        towingFee: 125.00,
        storageFee: 0.00,
        adminFee: 25.00,
        timeline: [
          {
            action: "Towing request submitted",
            timestamp: "2024-11-18T13:15:00Z",
            notes: "No valid permit found after 30-minute grace period"
          },
          {
            action: "Tow truck dispatched",
            timestamp: "2024-11-18T13:30:00Z",
            notes: "Rapid Recovery unit #RR-089 assigned"
          }
        ]
      },
      {
        id: "tow-004",
        towingId: "TOW-2024-001237",
        licensePlate: "GHI 321",
        location: "18 Lincoln",
        towCompany: "Downtown Towing",
        requestTime: "2024-11-18T12:00:00Z",
        status: "pending",
        cost: 175.00,
        vehicleInfo: "BMW X5 2021",
        vehicleColor: "Black",
        vinLast4: "7890",
        violationType: "handicap",
        officerBadge: "22222",
        violationNotes: "Vehicle parked in handicap space without proper permit or placard. Clear violation of ADA regulations.",
        towingFee: 150.00,
        storageFee: 0.00,
        adminFee: 25.00,
        timeline: [
          {
            action: "Towing request submitted",
            timestamp: "2024-11-18T12:00:00Z",
            notes: "ADA violation - no handicap permit displayed"
          }
        ]
      },
      {
        id: "tow-005",
        towingId: "TOW-2024-001238",
        licensePlate: "JKL 654",
        location: "72 Park",
        towCompany: "Metro Towing",
        requestTime: "2024-11-18T10:45:00Z",
        status: "cancelled",
        cost: 0.00,
        vehicleInfo: "Nissan Altima 2017",
        vehicleColor: "Silver",
        vinLast4: "2468",
        violationType: "blocking-traffic",
        officerBadge: "33333",
        violationNotes: "Vehicle blocking traffic flow in main entrance. Owner returned before towing commenced.",
        towingFee: 0.00,
        storageFee: 0.00,
        adminFee: 0.00,
        timeline: [
          {
            action: "Towing request submitted",
            timestamp: "2024-11-18T10:45:00Z",
            notes: "Vehicle blocking main entrance traffic"
          },
          {
            action: "Towing request cancelled",
            timestamp: "2024-11-18T11:00:00Z",
            notes: "Vehicle owner returned and moved vehicle voluntarily"
          }
        ]
      },
      {
        id: "tow-006",
        towingId: "TOW-2024-001239",
        licensePlate: "MNO 987",
        location: "Pacs",
        towCompany: "City Tow Services",
        requestTime: "2024-11-17T18:30:00Z",
        status: "completed",
        cost: 225.00,
        vehicleInfo: "Chevrolet Tahoe 2022",
        vehicleColor: "Gray",
        vinLast4: "1357",
        violationType: "abandoned",
        officerBadge: "44444",
        violationNotes: "Vehicle abandoned for 72+ hours. Multiple notices posted. No response from owner.",
        towingFee: 175.00,
        storageFee: 25.00,
        adminFee: 25.00,
        timeline: [
          {
            action: "Abandoned vehicle reported",
            timestamp: "2024-11-14T09:00:00Z",
            notes: "Initial 72-hour notice posted"
          },
          {
            action: "Towing request submitted",
            timestamp: "2024-11-17T18:30:00Z",
            notes: "72-hour period expired, no owner contact"
          },
          {
            action: "Tow truck dispatched",
            timestamp: "2024-11-17T18:45:00Z",
            notes: "City Tow unit #CT-203 assigned"
          },
          {
            action: "Vehicle towed successfully",
            timestamp: "2024-11-17T19:20:00Z",
            notes: "Vehicle transported to city impound facility"
          }
        ]
      }
    ]
  };

  return (
    <div className="p-6">
      <TowingInteractive initialData={mockTowingData} />
    </div>
  );
}