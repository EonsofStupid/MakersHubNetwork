
import React, { useEffect } from 'react';
import { LogLevel, LogCategory, LogDetails } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

const AppBootstrap: React.FC = () => {
  useEffect(() => {
    // Log application startup
    const details: LogDetails = {
      source: 'AppBootstrap',
      moduleId: 'app-init'
    };
    
    logger.log(LogLevel.INFO, LogCategory.APP, 'Application initialized', details);
    
    return () => {
      // Log application shutdown
      logger.log(LogLevel.INFO, LogCategory.APP, 'Application shutdown', details);
    };
  }, []);
  
  return null;
};

export default AppBootstrap;
