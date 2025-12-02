'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import { ParkingProvider } from '@/contexts/ParkingContext';

export default function LayoutWrapper({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <ParkingProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        <main className={`transition-all duration-200 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-72'
        } pt-16`}>
          {children}
        </main>
      </div>
    </ParkingProvider>
  );
}
