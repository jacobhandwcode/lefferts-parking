import React from 'react';
import EmployeePermitsInteractive from './components/EmployeePermitsInteractive';

export const metadata = {
  title: 'Employee Permits - LF Parking Management System',
  description: 'Manage permanent parking permits for staff members without expiration date constraints. Handle employee permit administration, vehicle assignments, and departmental permit management.',
};

export default function EmployeePermitsPage() {
  const mockData = {
    stats: {
      totalPermits: 247,
      activePermits: 231,
      departments: 7,
      totalVehicles: 289,
      totalChange: "+12",
      activeChange: "+8",
      departmentChange: null,
      vehicleChange: "+15"
    },
    permits: [
      {
        id: "emp_001",
        employeeName: "Sarah Johnson",
        employeeId: "EMP-2024-001",
        employeePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        department: "administration",
        licensePlate: "ABC 123",
        vehicleCount: 1,
        issueDate: "2024-01-15",
        status: "active"
      },
      {
        id: "emp_002",
        employeeName: "Michael Chen",
        employeeId: "EMP-2024-002",
        employeePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        department: "security",
        licensePlate: "DEF 456",
        vehicleCount: 2,
        issueDate: "2024-01-20",
        status: "active"
      },
      {
        id: "emp_003",
        employeeName: "Emily Rodriguez",
        employeeId: "EMP-2024-003",
        employeePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        department: "finance",
        licensePlate: "GHI 789",
        vehicleCount: 1,
        issueDate: "2024-02-01",
        status: "active"
      },
      {
        id: "emp_004",
        employeeName: "David Thompson",
        employeeId: "EMP-2024-004",
        employeePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        department: "maintenance",
        licensePlate: "JKL 012",
        vehicleCount: 1,
        issueDate: "2024-02-05",
        status: "inactive"
      },
      {
        id: "emp_005",
        employeeName: "Lisa Wang",
        employeeId: "EMP-2024-005",
        employeePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        department: "customer_service",
        licensePlate: "MNO 345",
        vehicleCount: 1,
        issueDate: "2024-02-10",
        status: "active"
      },
      {
        id: "emp_006",
        employeeName: "Robert Martinez",
        employeeId: "EMP-2024-006",
        employeePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        department: "operations",
        licensePlate: "PQR 678",
        vehicleCount: 3,
        issueDate: "2024-02-15",
        status: "active"
      },
      {
        id: "emp_007",
        employeeName: "Jennifer Kim",
        employeeId: "EMP-2024-007",
        employeePhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        department: "management",
        licensePlate: "STU 901",
        vehicleCount: 2,
        issueDate: "2024-02-20",
        status: "active"
      },
      {
        id: "emp_008",
        employeeName: "James Wilson",
        employeeId: "EMP-2024-008",
        employeePhoto: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
        department: "security",
        licensePlate: "VWX 234",
        vehicleCount: 1,
        issueDate: "2024-03-01",
        status: "suspended"
      },
      {
        id: "emp_009",
        employeeName: "Amanda Davis",
        employeeId: "EMP-2024-009",
        employeePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
        department: "administration",
        licensePlate: "YZA 567",
        vehicleCount: 1,
        issueDate: "2024-03-05",
        status: "active"
      },
      {
        id: "emp_010",
        employeeName: "Christopher Lee",
        employeeId: "EMP-2024-010",
        employeePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        department: "maintenance",
        licensePlate: "BCD 890",
        vehicleCount: 2,
        issueDate: "2024-03-10",
        status: "active"
      },
      {
        id: "emp_011",
        employeeName: "Nicole Brown",
        employeeId: "EMP-2024-011",
        employeePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        department: "finance",
        licensePlate: "EFG 123",
        vehicleCount: 1,
        issueDate: "2024-03-15",
        status: "active"
      },
      {
        id: "emp_012",
        employeeName: "Kevin Garcia",
        employeeId: "EMP-2024-012",
        employeePhoto: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        department: "operations",
        licensePlate: "HIJ 456",
        vehicleCount: 1,
        issueDate: "2024-03-20",
        status: "active"
      }
    ]
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Employee Permits</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage permanent parking permits for staff members without expiration constraints
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Content */}
            <EmployeePermitsInteractive initialData={mockData} />
      </div>
    </div>
  );
}