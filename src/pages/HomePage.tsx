
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BuildShowcase } from '@/components/landing/BuildShowcase';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';

export const HomePage: React.FC = () => {
  const logger = useLogger('HomePage', LogCategory.SYSTEM);
  const { applyToMainSite } = useImpulsivityTheme();
  
  // Apply theme on component mount
  React.useEffect(() => {
    logger.debug('HomePage loaded');
    applyToMainSite();
  }, [logger, applyToMainSite]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Our Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Your complete solution for creative builds and community sharing.
            </p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <FeaturesSection />
      
      {/* Build showcase */}
      <BuildShowcase />
    </div>
  );
};
