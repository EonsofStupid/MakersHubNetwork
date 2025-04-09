import React from 'react';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ConnectedBuildShowcase } from '@/components/landing/ConnectedBuildShowcase';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { ImpulsivityInit } from '@/components/theme/ImpulsivityInit';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function HomePage() {
  const logger = useLogger('HomePage', LogCategory.UI);

  React.useEffect(() => {
    logger.info('HomePage rendered');
  }, [logger]);

  return (
    <ImpulsivityInit priority={true} autoApply={true}>
      <div className="min-h-screen w-full">
        {/* Hero section would go here */}
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* Build showcase - connected to real data */}
        <ConnectedBuildShowcase />
        
        {/* Additional sections would go here */}
      </div>
    </ImpulsivityInit>
  );
}
