
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LogEntry, LogLevel } from '../types';
import { logEventEmitter } from '../events';
import { getLogger } from '../service/logger.service';
import { memoryTransport } from '../transports/memory.transport';

interface LoggingContextType {
  logs: LogEntry[];
  clearLogs: () => void;
  setMinLevel: (level: LogLevel) => void;
  minLevel: LogLevel;
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  toggleLogConsole: () => void;
  filteredLogs: (category?: string) => LogEntry[];
}

const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [minLevel, setMinLevel] = useState<LogLevel>(LogLevel.INFO);
  const [showLogConsole, setShowLogConsole] = useState<boolean>(false);
  const logger = getLogger('LoggingContext');

  // Initialize logs from memory
  useEffect(() => {
    try {
      setLogs(memoryTransport.getLogs());
    } catch (error) {
      console.error('Error initializing logs from memory:', error);
    }
  }, []);

  // Subscribe to log events
  useEffect(() => {
    const unsubscribe = logEventEmitter.onLog((entry: LogEntry) => {
      setLogs(prevLogs => [...prevLogs, entry]);
    });

    logger.info('Logging context initialized', {
      details: { listenerCount: logEventEmitter.getListenerCount() }
    });

    return () => {
      unsubscribe();
      logger.info('Logging context destroyed');
    };
  }, [logger]);

  // Clear logs
  const clearLogs = useCallback(() => {
    memoryTransport.clear();
    setLogs([]);
    logger.info('Logs cleared');
  }, [logger]);

  // Toggle log console visibility
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);

  // Get filtered logs
  const filteredLogs = useCallback((category?: string) => {
    if (!category) return logs;
    return logs.filter(log => log.category === category);
  }, [logs]);

  const value = {
    logs,
    clearLogs,
    setMinLevel,
    minLevel,
    showLogConsole,
    setShowLogConsole,
    toggleLogConsole,
    filteredLogs
  };

  return (
    <LoggingContext.Provider value={value}>
      {children}
    </LoggingContext.Provider>
  );
};

export const useLoggingContext = (): LoggingContextType => {
  const context = useContext(LoggingContext);
  if (context === undefined) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  return context;
};
