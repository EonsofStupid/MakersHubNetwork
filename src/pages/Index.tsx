import React from 'react';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BuildShowcase } from '@/components/landing/BuildShowcase';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';

export default function Index() {
  // Ensure Impulsivity theme is applied
  const { applyToMainSite } = useImpulsivityTheme();

  // Apply theme on component mount
  React.useEffect(() => {
    applyToMainSite();
  }, [applyToMainSite]);

  return (
    <div className="min-h-screen">
      {/* Hero section would go here */}
      
      {/* Features section */}
      <FeaturesSection />
      
      {/* Build showcase */}
      <BuildShowcase />
      
      {/* Additional sections would go here */}
    </div>
  );
}
