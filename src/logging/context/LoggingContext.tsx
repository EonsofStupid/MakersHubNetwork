
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoggerService, getLogger, initializeLogger } from '..';
import { LogCategory, LogLevel } from '../types';

interface LoggingContextType {
  logger: LoggerService;
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  minLogLevel: LogLevel;
  setMinLogLevel: (level: LogLevel) => void;
  enabledCategories: LogCategory[];
  setEnabledCategories: (categories: LogCategory[]) => void;
}

// Create the logging context
const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

interface LoggingProviderProps {
  children: React.ReactNode;
}

export const LoggingProvider: React.FC<LoggingProviderProps> = ({ children }) => {
  const [logInitialized, setLogInitialized] = useState(false);
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [minLogLevel, setMinLogLevel] = useState<LogLevel>(LogLevel.INFO);
  const [enabledCategories, setEnabledCategories] = useState<LogCategory[]>(
    Object.values(LogCategory)
  );

  // Initialize logger on mount
  useEffect(() => {
    if (!logInitialized) {
      try {
        initializeLogger();
        setLogInitialized(true);
      } catch (error) {
        console.error('Failed to initialize logger:', error);
      }
    }
  }, [logInitialized]);

  // Update logger config when settings change
  useEffect(() => {
    if (logInitialized) {
      const logger = getLogger();
      logger.updateConfig({
        minLevel: minLogLevel,
        enabledCategories
      });
    }
  }, [logInitialized, minLogLevel, enabledCategories]);

  const value = {
    logger: getLogger(),
    showLogConsole,
    setShowLogConsole,
    minLogLevel,
    setMinLogLevel,
    enabledCategories,
    setEnabledCategories
  };

  return (
    <LoggingContext.Provider value={value}>
      {children}
    </LoggingContext.Provider>
  );
};

// Hook for using the logging context
export const useLoggingContext = (): LoggingContextType => {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  return context;
};
