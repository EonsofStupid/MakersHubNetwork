
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LogEntry, LogLevel } from '../types';
import { loggerService } from '../service/logger.service';
import { memoryTransport } from '../transports/memory.transport';
import { logEventEmitter } from '../events';

interface LoggingContextType {
  logs: LogEntry[];
  clearLogs: () => void;
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  toggleLogConsole: () => void;
  minLogLevel: LogLevel;
  setMinLogLevel: (level: LogLevel) => void;
}

const LoggingContext = createContext<LoggingContextType>({
  logs: [],
  clearLogs: () => {},
  showLogConsole: false,
  setShowLogConsole: () => {},
  toggleLogConsole: () => {},
  minLogLevel: LogLevel.INFO,
  setMinLogLevel: () => {},
});

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [minLogLevel, setMinLogLevel] = useState(LogLevel.INFO);
  
  const toggleLogConsole = () => setShowLogConsole(prev => !prev);
  
  // Clear logs
  const clearLogs = () => {
    memoryTransport.clear();
    setLogs([]);
  };
  
  // Update logs when new ones arrive
  useEffect(() => {
    // Initial load
    setLogs(memoryTransport.getLogs());
    
    // Subscribe to new logs
    const unsubscribe = logEventEmitter.onLog((entry) => {
      setLogs(prev => {
        // Add to the beginning to show newest first
        const newLogs = [entry, ...prev];
        // Limit the number of logs in state to prevent performance issues
        return newLogs.slice(0, 1000);
      });
    });
    
    return unsubscribe;
  }, []);
  
  // Update min log level when it changes
  useEffect(() => {
    loggerService.updateConfig({
      minLevel: minLogLevel
    });
  }, [minLogLevel]);
  
  // Create memoized context value
  const contextValue = useMemo(() => ({
    logs,
    clearLogs,
    showLogConsole,
    setShowLogConsole,
    toggleLogConsole,
    minLogLevel,
    setMinLogLevel,
  }), [logs, showLogConsole, minLogLevel]);
  
  return (
    <LoggingContext.Provider value={contextValue}>
      {children}
    </LoggingContext.Provider>
  );
}

export function useLoggingContext() {
  const context = useContext(LoggingContext);
  
  if (!context) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  
  return context;
}
