
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLogger } from '../index';
import { LogLevel, LogCategory } from '../types';

interface LoggingContextType {
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  logSystemStartup: () => void;
}

const LoggingContext = createContext<LoggingContextType>({
  showLogConsole: false,
  setShowLogConsole: () => {},
  logSystemStartup: () => {}
});

export const useLoggingContext = () => useContext(LoggingContext);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogConsole, setShowLogConsole] = useState(false);
  const logger = getLogger();
  
  // Log system startup
  const logSystemStartup = () => {
    logger.info('Application UI initialized', {
      category: LogCategory.SYSTEM,
      details: {
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString(),
      },
      tags: ['startup', 'initialization']
    });
  };
  
  // Log initial startup
  useEffect(() => {
    logSystemStartup();
    
    // Log performance data
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      logger.info('LoggingProvider unmounted', {
        category: LogCategory.PERFORMANCE,
        details: { durationMs: duration },
        tags: ['lifecycle', 'performance']
      });
    };
  }, []);
  
  // Listen for key combinations to toggle log console (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        setShowLogConsole(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <LoggingContext.Provider value={{ 
      showLogConsole, 
      setShowLogConsole,
      logSystemStartup 
    }}>
      {children}
    </LoggingContext.Provider>
  );
};
