import React from 'react';
import MaintenanceLogInteractive from './components/MaintenanceLogInteractive';

export const metadata = {
  title: 'Maintenance Log - LF Parking Management',
  description: 'Track and manage maintenance activities across all parking facilities'
};

const MaintenanceLogPage = () => {
  const initialData = {
    maintenance: [],
    locations: ['Pacs', '11 ST', '54 Flagler', '18 Lincoln', '72 Park'],
    operators: [
      { id: 'OP001', name: 'John Martinez', role: 'Facility Manager' },
      { id: 'OP002', name: 'Sarah Chen', role: 'Maintenance Supervisor' },
      { id: 'OP003', name: 'Mike Thompson', role: 'Technical Lead' },
      { id: 'OP004', name: 'Lisa Rodriguez', role: 'Operations Manager' }
    ]
  };

  return <MaintenanceLogInteractive initialData={initialData} />;
};

export default MaintenanceLogPage;