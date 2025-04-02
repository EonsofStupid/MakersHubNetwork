
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LogEntry, LogCategory, LogLevel } from '../types';
import { onLog, clearLogs, getLogs } from '../index';
import { useLogger } from '../hooks/use-logger';
import { nodeToSearchableString } from '../utils/react-utils';

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
  
  const logger = useLogger('LoggingContext', LogCategory.SYSTEM);

  // Toggle console visibility
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);

  // Clear all logs
  const clearAllLogs = useCallback(() => {
    clearLogs();
    setLogs([]);
    logger.info('Logs cleared by user');
  }, [logger]);

  // Subscribe to log events
  useEffect(() => {
    logger.debug('Setting up log event subscription');

    const unsubscribe = onLog((entry: LogEntry) => {
      setLogs(prev => [entry, ...prev]);
    });

    // Initial load of existing logs
    setLogs(getLogs().reverse());

    return () => {
      unsubscribe();
      logger.debug('Log event subscription removed');
    };
  }, [logger]);
  
  // Filter logs based on criteria
  const filteredLogs = React.useMemo(() => {
    let filtered = [...logs];
    
    // Filter by level
    if (filterMinLevel !== undefined) {
      filtered = filtered.filter(log => log.level >= filterMinLevel);
    }
    
    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(log => log.category === filterCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(log => {
        const messageStr = nodeToSearchableString(log.message).toLowerCase();
        const sourceStr = log.source ? log.source.toLowerCase() : '';
        const categoryStr = log.category.toLowerCase();
        
        return messageStr.includes(searchLower) || 
               sourceStr.includes(searchLower) || 
               categoryStr.includes(searchLower);
      });
    }
    
    return filtered;
  }, [logs, filterMinLevel, filterCategory, searchTerm]);

  const value = {
    logs: filteredLogs,
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
