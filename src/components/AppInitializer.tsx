
import React, { useEffect, useState } from 'react';
import { getLogger } from '@/logging';

interface AppInitializerProps {
  children: React.ReactNode;
}

const logger = getLogger('AppInitializer');

export function AppInitializer({ children }: AppInitializerProps) {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Perform any app initialization here
    logger.info('Initializing application...');
    
    // Mark as initialized
    setInitialized(true);
    logger.info('Application initialized successfully');
  }, []);
  
  // Show children once initialized
  return <>{initialized ? children : null}</>;
}
