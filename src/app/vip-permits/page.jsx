import React from 'react';
import VipPermitsInteractive from './components/VipPermitsInteractive';

export const metadata = {
  title: 'VIP Permits - LF Parking Management System',
  description: 'Manage premium parking permits for executives and special guests with company affiliation tracking and advanced access controls.'
};

export default function VipPermitsPage() {
  const mockVipPermits = [
  {
    id: 1,
    name: "Robert Chen",
    title: "Chief Executive Officer",
    company: "Tech Corporation",
    department: "Executive Office",
    email: "robert.chen@techcorp.com",
    phone: "+1 555 123-4567",
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_1e333b90c-1763502443582.png",
    licensePlates: ["EXEC001", "TECH123"],
    accessLevel: "executive",
    status: "active",
    notes: "CEO access to all facilities",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-11-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Sarah Williams",
    title: "Managing Director",
    company: "Global Finance Ltd",
    department: "Investment Banking",
    email: "sarah.williams@globalfinance.com",
    phone: "+1 555 234-5678",
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_10cf7dfed-1763294953754.png",
    licensePlates: ["FINANCE1"],
    accessLevel: "vip",
    status: "active",
    notes: "VIP client access",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-11-10T14:20:00Z"
  },
  {
    id: 3,
    name: "Dr. Michael Rodriguez",
    title: "Chief Medical Officer",
    company: "Medical Center Group",
    department: "Administration",
    email: "m.rodriguez@medcenter.org",
    phone: "+1 555 345-6789",
    photo: "https://images.unsplash.com/photo-1654741970407-bda57c3e2ac5",
    licensePlates: ["DOC2024", "MEDIC01"],
    accessLevel: "executive",
    status: "active",
    notes: "Emergency access required",
    createdAt: "2024-03-10T11:30:00Z",
    updatedAt: "2024-11-12T16:45:00Z"
  },
  {
    id: 4,
    name: "Jennifer Thompson",
    title: "Senior Partner",
    company: "Premier Law Firm",
    department: "Corporate Law",
    email: "j.thompson@premierlaw.com",
    phone: "+1 555 456-7890",
    photo: "https://images.unsplash.com/photo-1682441488294-325b749d0d67",
    licensePlates: ["LAW2024"],
    accessLevel: "premium",
    status: "active",
    notes: "Court appearance priority",
    createdAt: "2024-04-05T13:20:00Z",
    updatedAt: "2024-11-08T09:10:00Z"
  },
  {
    id: 5,
    name: "David Park",
    title: "Principal Consultant",
    company: "Elite Consulting",
    department: "Strategy",
    email: "david.park@eliteconsult.com",
    phone: "+1 555 567-8901",
    photo: "https://images.unsplash.com/photo-1598360431128-f38f4674cbae",
    licensePlates: ["CONSULT1", "ELITE99"],
    accessLevel: "vip",
    status: "suspended",
    notes: "Temporary suspension - payment issue",
    createdAt: "2024-05-12T15:45:00Z",
    updatedAt: "2024-11-05T12:30:00Z"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    title: "Board Member",
    company: "Tech Corporation",
    department: "Board of Directors",
    email: "lisa.anderson@techcorp.com",
    phone: "+1 555 678-9012",
    photo: "https://img.rocket.new/generatedImages/rocket_gen_img_11c17b51e-1763300898941.png",
    licensePlates: ["BOARD01"],
    accessLevel: "executive",
    status: "active",
    notes: "Board meeting access",
    createdAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-11-14T11:15:00Z"
  },
  {
    id: 7,
    name: "James Wilson",
    title: "Guest Speaker",
    company: "Innovation Labs",
    department: "Research & Development",
    email: "james.wilson@innovationlabs.com",
    phone: "+1 555 789-0123",
    photo: "https://images.unsplash.com/photo-1709571129556-faf81fe15f33",
    licensePlates: ["GUEST24"],
    accessLevel: "guest",
    status: "expired",
    notes: "Conference guest - expired",
    createdAt: "2024-07-22T14:30:00Z",
    updatedAt: "2024-10-22T14:30:00Z"
  },
  {
    id: 8,
    name: "Maria Garcia",
    title: "VP of Operations",
    company: "Global Finance Ltd",
    department: "Operations",
    email: "maria.garcia@globalfinance.com",
    phone: "+1 555 890-1234",
    photo: "https://images.unsplash.com/photo-1712492424586-845b57442ede",
    licensePlates: ["OPS2024", "GLOBAL1"],
    accessLevel: "premium",
    status: "active",
    notes: "Operations oversight access",
    createdAt: "2024-08-15T16:20:00Z",
    updatedAt: "2024-11-13T13:40:00Z"
  },
  {
    id: 9,
    name: "Thomas Lee",
    title: "Senior Advisor",
    company: "Elite Consulting",
    department: "Advisory Board",
    email: "thomas.lee@eliteconsult.com",
    phone: "+1 555 901-2345",
    photo: "https://images.unsplash.com/photo-1555438468-aafd1ab4234d",
    licensePlates: ["ADVISOR1"],
    accessLevel: "vip",
    status: "pending",
    notes: "Pending background verification",
    createdAt: "2024-09-10T12:15:00Z",
    updatedAt: "2024-11-16T08:25:00Z"
  },
  {
    id: 10,
    name: "Amanda Foster",
    title: "Chief Financial Officer",
    company: "Medical Center Group",
    department: "Finance",
    email: "amanda.foster@medcenter.org",
    phone: "+1 555 012-3456",
    photo: "https://images.unsplash.com/photo-1614029951470-ef9eb9952be7",
    licensePlates: ["CFO2024", "MEDCFO1"],
    accessLevel: "executive",
    status: "active",
    notes: "Financial oversight access",
    createdAt: "2024-10-05T09:45:00Z",
    updatedAt: "2024-11-17T15:20:00Z"
  }];


  const initialData = {
    permits: mockVipPermits
  };

  return <VipPermitsInteractive initialData={initialData} />;
}