
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LogEntry, LoggingContextType } from '../types';
import { getLogger, getTransport } from '@/logging';
import { LogLevel } from '@/constants/logLevel';

// Create the context with a default value
const LoggingContext = createContext<LoggingContextType>({
  logs: [],
  clearLogs: () => {},
  showLogConsole: false,
  setShowLogConsole: () => {},
  toggleLogConsole: () => {},
  minLogLevel: LogLevel.INFO,
  setMinLogLevel: () => {}
});

interface LoggingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that allows consuming components to subscribe to logging changes
 */
export const LoggingProvider: React.FC<LoggingProviderProps> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [minLogLevel, setMinLogLevel] = useState<LogLevel>(LogLevel.INFO);

  // Clear logs
  const clearLogs = useCallback(() => {
    const memoryTransport = getTransport('memory');
    if (memoryTransport?.clear) {
      memoryTransport.clear();
    }
    setLogs([]);
  }, []);

  // Toggle log console visibility
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);

  // Set minimum log level for display
  const handleSetMinLogLevel = useCallback((level: LogLevel) => {
    setMinLogLevel(level);
  }, []);

  // Subscribe to log events
  useEffect(() => {
    const logger = getLogger();
    const memoryTransport = getTransport('memory');
    
    // Initial logs
    if (memoryTransport?.getLogs) {
      setLogs(memoryTransport.getLogs());
    }
    
    // Subscribe to new logs
    const unsubscribe = logger.subscribe((entry: LogEntry) => {
      setLogs(currentLogs => [...currentLogs, entry]);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const contextValue: LoggingContextType = {
    logs,
    clearLogs,
    showLogConsole,
    setShowLogConsole,
    toggleLogConsole,
    minLogLevel,
    setMinLogLevel: handleSetMinLogLevel
  };

  return (
    <LoggingContext.Provider value={contextValue}>
      {children}
    </LoggingContext.Provider>
  );
};

/**
 * Custom hook to use the logging context
 */
export const useLoggingContext = (): LoggingContextType => {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  return context;
};
