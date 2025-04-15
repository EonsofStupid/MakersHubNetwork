
import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/logging/logger.service';
import { LogEntry, LogLevel, LogCategory } from '@/shared/types';
import { X, Filter, Download, RefreshCw } from 'lucide-react';

interface LogConsoleProps {
  initialVisible?: boolean;
  onClose?: () => void;
}

export const LogConsole: React.FC<LogConsoleProps> = ({ 
  initialVisible = false, 
  onClose 
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [visible, setVisible] = useState(initialVisible);
  const [filter, setFilter] = useState({
    level: 'info' as LogLevel,
    category: '' as string,
    search: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial logs and subscribe to new logs
  useEffect(() => {
    if (!visible) return;
    
    try {
      // Get initial logs from memory transport if available
      const memoryTransport = logger.getTransport('memory');
      if (memoryTransport) {
        const entries = memoryTransport.getEntries();
        setLogs(entries);
      }
      
      // Subscribe to new logs
      const unsubscribe = logger.subscribe((entry: LogEntry) => {
        setLogs(prev => [...prev, entry]);
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing LogConsole:', error);
    }
  }, [visible]);
  
  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (messagesEndRef.current && visible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, visible]);
  
  // Handle close
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  // Apply filters
  const filteredLogs = logs.filter(log => {
    // Filter by level (show equal or higher severity)
    if (filter.level && LogLevel[filter.level.toUpperCase() as keyof typeof LogLevel]) {
      const minLevelValue = LogLevel[filter.level.toUpperCase() as keyof typeof LogLevel];
      const logLevelValue = LogLevel[log.level.toUpperCase() as keyof typeof LogLevel];
      if (logLevelValue < minLevelValue) return false;
    }
    
    // Filter by category
    if (filter.category && filter.category !== 'all' && log.category !== filter.category) {
      return false;
    }
    
    // Filter by search text
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const messageMatch = log.message.toLowerCase().includes(searchLower);
      const detailsMatch = log.details ? 
        JSON.stringify(log.details).toLowerCase().includes(searchLower) : false;
        
      if (!messageMatch && !detailsMatch) return false;
    }
    
    return true;
  });
  
  if (!visible) return null;
  
  // Get available categories from logs
  const categories = Array.from(new Set(logs.map(log => log.category)));
  
  const downloadLogs = () => {
    try {
      const logsJson = JSON.stringify(logs, null, 2);
      const blob = new Blob([logsJson], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `logs-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download logs:', error);
    }
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-200 z-50 border-t border-slate-700"
      ref={consoleRef}
      style={{ height: '40vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div className="p-2 border-b border-slate-700 flex items-center justify-between bg-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-mono font-bold">Log Console</h3>
          <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-md">{filteredLogs.length} entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={clearLogs}
            className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Clear
          </button>
          
          <button 
            onClick={downloadLogs}
            className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 flex items-center gap-1"
          >
            <Download size={12} />
            Download
          </button>
          
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="p-2 border-b border-slate-700 bg-slate-800 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400">Filters:</span>
        </div>
        
        <select
          value={filter.level}
          onChange={e => setFilter({...filter, level: e.target.value as LogLevel})}
          className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1"
        >
          <option value="debug">Debug & Above</option>
          <option value="info">Info & Above</option>
          <option value="warn">Warning & Above</option>
          <option value="error">Error & Above</option>
          <option value="critical">Critical & Above</option>
        </select>
        
        <select
          value={filter.category}
          onChange={e => setFilter({...filter, category: e.target.value})}
          className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          {/* Add standard categories that might not be in logs yet */}
          {!categories.includes(LogCategory.AUTH) && <option value={LogCategory.AUTH}>{LogCategory.AUTH}</option>}
          {!categories.includes(LogCategory.RBAC) && <option value={LogCategory.RBAC}>{LogCategory.RBAC}</option>}
          {!categories.includes(LogCategory.API) && <option value={LogCategory.API}>{LogCategory.API}</option>}
          {!categories.includes(LogCategory.UI) && <option value={LogCategory.UI}>{LogCategory.UI}</option>}
          {!categories.includes(LogCategory.SYSTEM) && <option value={LogCategory.SYSTEM}>{LogCategory.SYSTEM}</option>}
          {!categories.includes(LogCategory.ADMIN) && <option value={LogCategory.ADMIN}>{LogCategory.ADMIN}</option>}
          {!categories.includes(LogCategory.THEME) && <option value={LogCategory.THEME}>{LogCategory.THEME}</option>}
          {!categories.includes(LogCategory.DEBUG) && <option value={LogCategory.DEBUG}>{LogCategory.DEBUG}</option>}
          {!categories.includes(LogCategory.APP) && <option value={LogCategory.APP}>{LogCategory.APP}</option>}
          {!categories.includes(LogCategory.CHAT) && <option value={LogCategory.CHAT}>{LogCategory.CHAT}</option>}
        </select>
        
        <input
          type="text"
          placeholder="Search..."
          value={filter.search}
          onChange={e => setFilter({...filter, search: e.target.value})}
          className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 flex-1 min-w-[150px]"
        />
      </div>
      
      {/* Logs */}
      <div className="flex-1 overflow-auto p-0 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            No logs to display
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-slate-800">
              <tr>
                <th className="p-1 text-left text-slate-400 border-b border-slate-700">Time</th>
                <th className="p-1 text-left text-slate-400 border-b border-slate-700">Level</th>
                <th className="p-1 text-left text-slate-400 border-b border-slate-700">Category</th>
                <th className="p-1 text-left text-slate-400 border-b border-slate-700">Message</th>
                <th className="p-1 text-left text-slate-400 border-b border-slate-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr 
                  key={log.id || index} 
                  className={`
                    border-b border-slate-800 hover:bg-slate-800/50
                    ${log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL || log.level === LogLevel.FATAL ? 'bg-red-900/20' : ''}
                    ${log.level === LogLevel.WARN ? 'bg-yellow-900/10' : ''}
                    ${log.level === LogLevel.SUCCESS ? 'bg-green-900/10' : ''}
                  `}
                >
                  <td className="p-1 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className={`p-1 whitespace-nowrap ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </td>
                  <td className="p-1 text-slate-300 whitespace-nowrap">
                    {log.category}
                  </td>
                  <td className="p-1 text-slate-100">
                    {log.message}
                  </td>
                  <td className="p-1 text-slate-400 max-w-xs truncate">
                    {log.details ? (
                      <details>
                        <summary className="cursor-pointer hover:text-slate-200">View details</summary>
                        <pre className="mt-1 p-1 bg-slate-800 rounded overflow-auto max-h-40">
                          {formatDetails(log.details)}
                        </pre>
                      </details>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

function getLogLevelColor(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'text-blue-300';
    case LogLevel.INFO:
      return 'text-cyan-300';
    case LogLevel.SUCCESS:
      return 'text-green-300';
    case LogLevel.WARN:
      return 'text-yellow-300';
    case LogLevel.ERROR:
      return 'text-red-300';
    case LogLevel.CRITICAL:
    case LogLevel.FATAL:
      return 'text-red-500 font-bold';
    case LogLevel.TRACE:
      return 'text-purple-300';
    default:
      return 'text-slate-300';
  }
}

function formatDetails(details: any): string {
  try {
    if (typeof details === 'string') return details;
    return JSON.stringify(details, null, 2);
  } catch (error) {
    return String(details);
  }
}

export default LogConsole;
