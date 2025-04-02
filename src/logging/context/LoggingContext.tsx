
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LogEntry, LogCategory, LogLevel } from '../types';
import { onLog, clearLogs } from '../index';
import { memoryTransport } from '../transports/memory';

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
  
  // Initialize logs from memory transport
  useEffect(() => {
    setLogs(memoryTransport.getLogs());
    
    // Subscribe to log events
    const unsubscribe = onLog((entry: LogEntry) => {
      setLogs(prev => [entry, ...prev]);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);
  
  const clearAllLogs = useCallback(() => {
    clearLogs();
    setLogs([]);
  }, []);
  
  return (
    <LoggingContext.Provider
      value={{
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
      }}
    >
      {children}
    </LoggingContext.Provider>
  );
}

export function useLoggingContext() {
  const context = useContext(LoggingContext);
  
  if (context === undefined) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  
  return context;
}
