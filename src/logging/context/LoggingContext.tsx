
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LogEntry, LoggingContextType, LogLevel } from '../types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { memoryTransport } from '../transports/memory.transport';

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
  const logger = getLogger('LoggingContext', { category: LogCategory.SYSTEM });

  // Clear logs
  const clearLogs = useCallback(() => {
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
    // Initial logs
    if (memoryTransport?.getLogs) {
      setLogs(memoryTransport.getLogs());
    }
    
    // Set up log event handler
    const handleNewLog = (entry: LogEntry) => {
      setLogs(currentLogs => [...currentLogs, entry]);
    };
    
    // Add global event listener for logs
    const unsubscribe = memoryTransport?.subscribe ? 
      memoryTransport.subscribe(handleNewLog) : 
      () => {};
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
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
