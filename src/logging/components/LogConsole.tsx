
import React, { useState, useEffect, useRef } from 'react';
import { useLoggingContext } from '../context/LoggingContext';
import { LogLevel, LogCategory } from '../types';
import { LOG_LEVEL_NAMES } from '../constants/log-level';
import { X, ArrowDown, ArrowUp, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { nodeToSearchableString, safelyRenderLogNode } from '../utils/react-utils';

export function LogConsole() {
  const { 
    logs, 
    clearAllLogs, 
    filterCategory, 
    setFilterCategory,
    filterMinLevel,
    setFilterMinLevel,
    searchTerm,
    setSearchTerm,
    showLogConsole,
    toggleLogConsole 
  } = useLoggingContext();
  
  // Auto-scrolling
  const logContainerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);
  
  // Don't render if not visible
  if (!showLogConsole) {
    return null;
  }
  
  const getLogLevelClass = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'text-red-500';
      case LogLevel.WARN:
        return 'text-yellow-500';
      case LogLevel.SUCCESS:
        return 'text-green-500';
      case LogLevel.INFO:
        return 'text-blue-500';
      case LogLevel.DEBUG:
        return 'text-gray-400';
      case LogLevel.TRACE:
        return 'text-gray-300';
      default:
        return 'text-gray-600';
    }
  };
  
  const getCategoryClass = (category: LogCategory) => {
    switch (category) {
      case LogCategory.SYSTEM:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case LogCategory.NETWORK:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case LogCategory.AUTH:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case LogCategory.UI:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case LogCategory.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case LogCategory.DATA:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case LogCategory.PERFORMANCE:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 h-96">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLogConsole}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close logs"
          >
            <X size={16} />
          </button>
          <h3 className="text-sm font-medium">Application Logs ({logs.length})</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>
          
          {/* Level filter */}
          <select
            value={filterMinLevel}
            onChange={(e) => setFilterMinLevel(Number(e.target.value) as LogLevel)}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            <option value={LogLevel.TRACE}>Trace+</option>
            <option value={LogLevel.DEBUG}>Debug+</option>
            <option value={LogLevel.INFO}>Info+</option>
            <option value={LogLevel.WARN}>Warning+</option>
            <option value={LogLevel.ERROR}>Error+</option>
            <option value={LogLevel.CRITICAL}>Critical+</option>
          </select>
          
          {/* Category filter */}
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value ? e.target.value as LogCategory : null)}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          >
            <option value="">All Categories</option>
            {Object.values(LogCategory).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button
            onClick={clearAllLogs}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
            aria-label="Clear logs"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Log content */}
      <div 
        ref={logContainerRef}
        className="h-[calc(100%-36px)] overflow-auto font-mono text-xs p-2"
      >
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 my-4">No logs to display</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-gray-900">
              <tr>
                <th className="text-left p-1 border-b border-gray-200 dark:border-gray-700">Time</th>
                <th className="text-left p-1 border-b border-gray-200 dark:border-gray-700">Level</th>
                <th className="text-left p-1 border-b border-gray-200 dark:border-gray-700">Category</th>
                <th className="text-left p-1 border-b border-gray-200 dark:border-gray-700">Source</th>
                <th className="text-left p-1 border-b border-gray-200 dark:border-gray-700 w-full">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-1 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className={`p-1 border-b border-gray-100 dark:border-gray-800 ${getLogLevelClass(log.level)}`}>
                    {LOG_LEVEL_NAMES[log.level]}
                  </td>
                  <td className="p-1 border-b border-gray-100 dark:border-gray-800">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${getCategoryClass(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="p-1 border-b border-gray-100 dark:border-gray-800 whitespace-nowrap">
                    {log.source || '-'}
                  </td>
                  <td className="p-1 border-b border-gray-100 dark:border-gray-800">
                    {safelyRenderLogNode(log.message)}
                    {log.details && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-blue-500 dark:text-blue-400">Details</summary>
                        <pre className="mt-1 p-1 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-48">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)
                          }
                        </pre>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
