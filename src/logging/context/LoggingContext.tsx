
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LogEntry, LogCategory, LogLevel } from '../types';
import { onLog, clearLogs, getLogs } from '../index';
import { getLogger } from '@/logging';

interface LoggingContextValue {
  logs: LogEntry[];
  showLogConsole: boolean;
  toggleLogConsole: () => void;
  clearAllLogs: () => void;
  filterCategory: LogCategory | null;
  setFilterCategory: (category: LogCategory | null) => void;
  filterMinLevel: LogLevel;
  setFilterMinLevel: (level: LogLevel) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const LoggingContext = createContext<LoggingContextValue | undefined>(undefined);

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [filterCategory, setFilterCategory] = useState<LogCategory | null>(null);
  const [filterMinLevel, setFilterMinLevel] = useState<LogLevel>(LogLevel.INFO);
  const [searchTerm, setSearchTerm] = useState('');
  
  const logger = getLogger('LoggingContext');

  // Toggle console visibility
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);

  // Clear all logs
  const clearAllLogs = useCallback(() => {
    clearLogs();
    setLogs([]);
    logger.info('Logs cleared by user', {
      category: LogCategory.SYSTEM
    });
  }, [logger]);

  // Subscribe to log events
  useEffect(() => {
    logger.debug('Setting up log event subscription', {
      category: LogCategory.SYSTEM
    });

    const unsubscribe = onLog((entry: LogEntry) => {
      setLogs(prev => [entry, ...prev]);
    });

    // Initial load of existing logs
    setLogs(getLogs().reverse());

    return () => {
      unsubscribe();
      logger.debug('Log event subscription removed', {
        category: LogCategory.SYSTEM
      });
    };
  }, [logger]);

  const value = {
    logs,
    showLogConsole,
    toggleLogConsole,
    clearAllLogs,
    filterCategory,
    setFilterCategory,
    filterMinLevel,
    setFilterMinLevel,
    searchTerm,
    setSearchTerm
  };

  return (
    <LoggingContext.Provider value={value}>
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
