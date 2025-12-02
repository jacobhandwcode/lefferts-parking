import React from 'react';
import DynamicPricingInteractive from './components/DynamicPricingInteractive';

export const metadata = {
  title: 'Dynamic Pricing Management - LF Parking',
  description: 'Configure and optimize pricing strategies across all parking locations with flexible rate management, surge pricing, and promotional coupons.',
};

export default function DynamicPricingManagementPage() {
  const initialData = {
    currentLocation: 'Pacs',
    availableLocations: [
      'Pacs',
      '11 ST', 
      '54 Flagler',
      '18 Lincoln',
      '72 Park'
    ],
    defaultPricingMode: 'fixed',
    lastUpdated: new Date()?.toISOString()
  };

  return (
    <DynamicPricingInteractive initialData={initialData} />
  );
}