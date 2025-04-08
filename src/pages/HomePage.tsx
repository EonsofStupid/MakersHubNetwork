
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export const HomePage: React.FC = () => {
  const logger = useLogger('HomePage', LogCategory.SYSTEM);
  
  // Log page load for debugging
  React.useEffect(() => {
    logger.debug('HomePage loaded');
  }, [logger]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Your application homepage
      </p>
    </div>
  );
};
