import React from 'react';
import CameraMonitoringInteractive from './components/CameraMonitoringInteractive';

export const metadata = {
  title: 'Camera Monitoring - LF Parking Management System',
  description: 'Real-time visual surveillance across all parking locations for security and operational oversight with multi-camera feeds and monitoring controls.'
};

export default function CameraMonitoringPage() {
  const mockData = {
    locations: [
      {
        id: 'pacs',
        name: 'Pacs Facility',
        address: 'Pacs Parking Lot',
        status: 'active',
        cameraCount: 5
      },
      {
        id: '11st',
        name: '11 ST Parking',
        address: '11 ST Parking Lot',
        status: 'active',
        cameraCount: 4
      },
      {
        id: '54flagler',
        name: '54 Flagler Garage',
        address: '789 Flagler Avenue, City Center',
        status: 'active',
        cameraCount: 6
      },
      {
        id: '18lincoln',
        name: '18 Lincoln Plaza',
        address: '18 Lincoln Parking Lot',
        status: 'maintenance',
        cameraCount: 3
      },
      {
        id: '72park',
        name: '72 Park Complex',
        address: '654 Park Avenue, Residential Area',
        status: 'active',
        cameraCount: 5
      }
    ],
    cameras: [
      // Pacs Facility Cameras
      {
        id: 1,
        name: 'Entrance Gate',
        location: 'Main Entrance',
        locationId: 'pacs',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 3
      },
      {
        id: 2,
        name: 'Level 1 Overview',
        location: 'Ground Floor',
        locationId: 'pacs',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 2
      },
      {
        id: 3,
        name: 'Level 2 North',
        location: 'Second Floor North',
        locationId: 'pacs',
        status: 'online',
        lastUpdate: '11:16 AM',
        isRecording: false,
        viewers: 1
      },
      {
        id: 4,
        name: 'Exit Booth',
        location: 'Main Exit',
        locationId: 'pacs',
        status: 'offline',
        lastUpdate: '10:45 AM',
        isRecording: false,
        viewers: 0
      },
      {
        id: 5,
        name: 'Perimeter Security',
        location: 'Exterior Fence',
        locationId: 'pacs',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 4
      },
      // 11 ST Parking Cameras
      {
        id: 6,
        name: 'Street Entry',
        location: 'Street Level Entry',
        locationId: '11st',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 2
      },
      {
        id: 7,
        name: 'Payment Kiosk',
        location: 'Payment Area',
        locationId: '11st',
        status: 'online',
        lastUpdate: '11:16 AM',
        isRecording: true,
        viewers: 1
      },
      {
        id: 8,
        name: 'Rooftop Level',
        location: 'Top Floor',
        locationId: '11st',
        status: 'maintenance',
        lastUpdate: '09:30 AM',
        isRecording: false,
        viewers: 0
      },
      {
        id: 9,
        name: 'Handicap Section',
        location: 'Accessible Parking',
        locationId: '11st',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: false,
        viewers: 1
      },
      // 54 Flagler Garage Cameras
      {
        id: 10,
        name: 'Garage Entrance',
        location: 'Main Vehicle Entry',
        locationId: '54flagler',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 5
      },
      {
        id: 11,
        name: 'Level A Overview',
        location: 'Basement Level A',
        locationId: '54flagler',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 2
      },
      {
        id: 12,
        name: 'Level B Overview',
        location: 'Basement Level B',
        locationId: '54flagler',
        status: 'online',
        lastUpdate: '11:16 AM',
        isRecording: true,
        viewers: 1
      },
      {
        id: 13,
        name: 'Elevator Bank',
        location: 'Central Elevators',
        locationId: '54flagler',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: false,
        viewers: 3
      },
      {
        id: 14,
        name: 'Emergency Exit',
        location: 'Stairwell Exit',
        locationId: '54flagler',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 1
      },
      {
        id: 15,
        name: 'VIP Section',
        location: 'Premium Parking',
        locationId: '54flagler',
        status: 'offline',
        lastUpdate: '10:22 AM',
        isRecording: false,
        viewers: 0
      },
      // 18 Lincoln Plaza Cameras
      {
        id: 16,
        name: 'Plaza Entry',
        location: 'Shopping Plaza Entry',
        locationId: '18lincoln',
        status: 'maintenance',
        lastUpdate: '08:15 AM',
        isRecording: false,
        viewers: 0
      },
      {
        id: 17,
        name: 'Customer Parking',
        location: 'Retail Customer Area',
        locationId: '18lincoln',
        status: 'maintenance',
        lastUpdate: '08:15 AM',
        isRecording: false,
        viewers: 0
      },
      {
        id: 18,
        name: 'Service Area',
        location: 'Loading Dock',
        locationId: '18lincoln',
        status: 'online',
        lastUpdate: '11:10 AM',
        isRecording: true,
        viewers: 1
      },
      // 72 Park Complex Cameras
      {
        id: 19,
        name: 'Complex Gate',
        location: 'Residential Gate',
        locationId: '72park',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 2
      },
      {
        id: 20,
        name: 'Visitor Parking',
        location: 'Guest Parking Area',
        locationId: '72park',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: false,
        viewers: 1
      },
      {
        id: 21,
        name: 'Resident Section A',
        location: 'Building A Parking',
        locationId: '72park',
        status: 'online',
        lastUpdate: '11:16 AM',
        isRecording: true,
        viewers: 3
      },
      {
        id: 22,
        name: 'Resident Section B',
        location: 'Building B Parking',
        locationId: '72park',
        status: 'online',
        lastUpdate: '11:17 AM',
        isRecording: true,
        viewers: 2
      },
      {
        id: 23,
        name: 'Recreation Area',
        location: 'Pool & Gym Parking',
        locationId: '72park',
        status: 'offline',
        lastUpdate: '09:45 AM',
        isRecording: false,
        viewers: 0
      }
    ]
  };

  return <CameraMonitoringInteractive initialData={mockData} />;
}