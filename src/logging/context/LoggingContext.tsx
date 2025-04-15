
import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/shared.types';

// Define the context type
export interface LoggingContextType {
  logs: LogEntry[];
  isConsoleVisible: boolean;
  toggleConsole: () => void;
  clearLogs: () => void;
  addLog: (log: LogEntry) => void;
  logLevel: LogLevel;
  setLogLevel: (level: LogLevel) => void;
}

// Create the context with default values
export const LoggingContext = createContext<LoggingContextType>({
  logs: [],
  isConsoleVisible: false,
  toggleConsole: () => {},
  clearLogs: () => {},
  addLog: () => {},
  logLevel: LogLevel.INFO,
  setLogLevel: () => {},
});

// Provider component
export function LoggingProvider({ 
  children, 
  defaultLevel = LogLevel.INFO
}: { 
  children: React.ReactNode;
  defaultLevel?: LogLevel;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleVisible, setIsConsoleVisible] = useState(false);
  const [logLevel, setLogLevel] = useState<LogLevel>(defaultLevel);
  
  // Subscribe to log events
  useEffect(() => {
    // Display initial log
    logger.log(
      LogLevel.INFO, 
      LogCategory.SYSTEM, 
      'Logging system initialized', 
      { logLevel }
    );
    
    // Subscribe to log events
    const unsubscribe = logger.subscribe((log) => {
      setLogs(prevLogs => [...prevLogs, log]);
    });
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Toggle console visibility
  const toggleConsole = () => {
    setIsConsoleVisible(prev => !prev);
  };
  
  // Add a log entry
  const addLog = (log: LogEntry) => {
    setLogs(prev => [...prev, log]);
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    
    // Access the memory transport and clear logs there too
    const memoryTransport = logger.getTransports().find(t => t.name === 'memory');
    if (memoryTransport && 'clearLogs' in memoryTransport) {
      (memoryTransport as any).clearLogs();
    }
  };
  
  return (
    <LoggingContext.Provider value={{
      logs,
      isConsoleVisible,
      toggleConsole,
      clearLogs,
      addLog,
      logLevel,
      setLogLevel,
    }}>
      {children}
    </LoggingContext.Provider>
  );
}

// Hook to use the logging context
export function useLoggingContext() {
  const context = useContext(LoggingContext);
  
  if (!context) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  
  return context;
}
