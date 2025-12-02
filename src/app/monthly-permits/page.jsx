import MonthlyPermitsInteractive from './components/MonthlyPermitsInteractive';

export const metadata = {
  title: 'Monthly Permits - LF Parking Management System',
  description: 'Manage time-limited parking permits with expiration date tracking and renewal workflows for comprehensive permit administration.'
};

export default function MonthlyPermitsPage() {
  const mockPermitsData = {
    permits: [
      {
        id: 1,
        permitId: "MP-001234",
        holderName: "Sarah Johnson",
        holderId: "EMP-2024-001",
        email: "sarah.johnson@company.com",
        phone: "+1 305 555-0123",
        vehicles: [
          {
            licensePlate: "ABC 123",
            make: "Toyota",
            model: "Camry",
            color: "Silver"
          },
          {
            licensePlate: "XYZ 789",
            make: "Honda",
            model: "Civic",
            color: "Blue"
          }
        ],
        issueDate: "2024-01-15",
        expiryDate: "2024-12-15",
        location: "Pacs",
        status: "active"
      },
      {
        id: 2,
        permitId: "MP-001235",
        holderName: "Michael Chen",
        holderId: "RES-2024-002",
        email: "m.chen@email.com",
        phone: "+1 305 555-0124",
        vehicles: [
          {
            licensePlate: "DEF 456",
            make: "BMW",
            model: "X3",
            color: "Black"
          }
        ],
        issueDate: "2024-02-01",
        expiryDate: "2025-02-01",
        location: "11 ST",
        status: "active"
      },
      {
        id: 3,
        permitId: "MP-001236",
        holderName: "Emily Rodriguez",
        holderId: "STU-2024-003",
        email: "emily.rodriguez@university.edu",
        phone: "+1 305 555-0125",
        vehicles: [
          {
            licensePlate: "GHI 789",
            make: "Nissan",
            model: "Altima",
            color: "White"
          }
        ],
        issueDate: "2024-03-10",
        expiryDate: "2024-11-25",
        location: "54 Flagler",
        status: "active"
      },
      {
        id: 4,
        permitId: "MP-001237",
        holderName: "David Thompson",
        holderId: "VIS-2024-004",
        email: "david.thompson@visitor.com",
        phone: "+1 305 555-0126",
        vehicles: [
          {
            licensePlate: "JKL 012",
            make: "Ford",
            model: "F-150",
            color: "Red"
          }
        ],
        issueDate: "2024-01-20",
        expiryDate: "2024-11-20",
        location: "18 Lincoln",
        status: "expired"
      },
      {
        id: 5,
        permitId: "MP-001238",
        holderName: "Lisa Wang",
        holderId: "CON-2024-005",
        email: "lisa.wang@contractor.com",
        phone: "+1 305 555-0127",
        vehicles: [
          {
            licensePlate: "MNO 345",
            make: "Chevrolet",
            model: "Malibu",
            color: "Gray"
          },
          {
            licensePlate: "PQR 678",
            make: "Hyundai",
            model: "Elantra",
            color: "Blue"
          }
        ],
        issueDate: "2024-04-05",
        expiryDate: "2025-04-05",
        location: "72 Park",
        status: "active"
      },
      {
        id: 6,
        permitId: "MP-001239",
        holderName: "Robert Martinez",
        holderId: "EMP-2024-006",
        email: "robert.martinez@company.com",
        phone: "+1 305 555-0128",
        vehicles: [
          {
            licensePlate: "STU 901",
            make: "Mercedes",
            model: "C-Class",
            color: "Black"
          }
        ],
        issueDate: "2024-05-15",
        expiryDate: "2025-05-15",
        location: "Pacs",
        status: "active"
      },
      {
        id: 7,
        permitId: "MP-001240",
        holderName: "Jennifer Lee",
        holderId: "RES-2024-007",
        email: "jennifer.lee@resident.com",
        phone: "+1 305 555-0129",
        vehicles: [
          {
            licensePlate: "VWX 234",
            make: "Audi",
            model: "A4",
            color: "Silver"
          }
        ],
        issueDate: "2024-06-01",
        expiryDate: "2025-06-01",
        location: "11 ST",
        status: "active"
      },
      {
        id: 8,
        permitId: "MP-001241",
        holderName: "James Wilson",
        holderId: "VIS-2024-008",
        email: "james.wilson@visitor.com",
        phone: "+1 305 555-0130",
        vehicles: [
          {
            licensePlate: "YZA 567",
            make: "Volkswagen",
            model: "Jetta",
            color: "White"
          }
        ],
        issueDate: "2024-02-28",
        expiryDate: "2024-11-28",
        location: "54 Flagler",
        status: "active"
      },
      {
        id: 9,
        permitId: "MP-001242",
        holderName: "Maria Garcia",
        holderId: "STU-2024-009",
        email: "maria.garcia@university.edu",
        phone: "+1 305 555-0131",
        vehicles: [
          {
            licensePlate: "BCD 890",
            make: "Subaru",
            model: "Outback",
            color: "Green"
          }
        ],
        issueDate: "2024-07-10",
        expiryDate: "2025-07-10",
        location: "18 Lincoln",
        status: "active"
      },
      {
        id: 10,
        permitId: "MP-001243",
        holderName: "Kevin Brown",
        holderId: "CON-2024-010",
        email: "kevin.brown@contractor.com",
        phone: "+1 305 555-0132",
        vehicles: [
          {
            licensePlate: "EFG 123",
            make: "Jeep",
            model: "Wrangler",
            color: "Orange"
          }
        ],
        issueDate: "2024-03-25",
        expiryDate: "2024-11-22",
        location: "72 Park",
        status: "active"
      },
      {
        id: 11,
        permitId: "MP-001244",
        holderName: "Amanda Davis",
        holderId: "EMP-2024-011",
        email: "amanda.davis@company.com",
        phone: "+1 305 555-0133",
        vehicles: [
          {
            licensePlate: "HIJ 456",
            make: "Mazda",
            model: "CX-5",
            color: "Red"
          }
        ],
        issueDate: "2024-08-01",
        expiryDate: "2025-08-01",
        location: "Pacs",
        status: "active"
      },
      {
        id: 12,
        permitId: "MP-001245",
        holderName: "Christopher Taylor",
        holderId: "RES-2024-012",
        email: "chris.taylor@resident.com",
        phone: "+1 305 555-0134",
        vehicles: [
          {
            licensePlate: "KLM 789",
            make: "Lexus",
            model: "RX",
            color: "Pearl White"
          }
        ],
        issueDate: "2024-01-10",
        expiryDate: "2024-11-21",
        location: "11 ST",
        status: "active"
      }
    ]
  };

  return <MonthlyPermitsInteractive initialData={mockPermitsData} />;
}