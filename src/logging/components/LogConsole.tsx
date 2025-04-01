import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useLoggingContext } from '../context/LoggingContext';
import { LogEntry } from '../types';
import { LogLevel } from '../constants/log-level';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, Info, CheckCircle, Bug, Code, ArrowDownCircle } from 'lucide-react';
import '../styles/logging.css';
import { renderUnknownAsNode } from '@/shared/utils/render';

interface LogDetailsProps {
  details: Record<string, any>;
  className?: string;
}

const LogDetails = forwardRef<HTMLDivElement, LogDetailsProps>(({ details, className = '' }, ref) => {
  if (!details || Object.keys(details).length === 0) {
    return null;
  }
  
  return (
    <div ref={ref} className={`log-details mt-1 p-2 bg-gray-800 rounded text-xs font-mono ${className}`}>
      {Object.entries(details).map(([key, value]) => (
        <div key={key} className="flex">
          <span className="text-gray-400 mr-2">{key}:</span>
          <span className="text-gray-300">
            {renderUnknownAsNode(value)}
          </span>
        </div>
      ))}
    </div>
  );
});

LogDetails.displayName = 'LogDetails';

interface LogItemProps {
  log: LogEntry;
  index: number;
}

const LogItem: React.FC<LogItemProps> = ({ log, index }) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = log.details && Object.keys(log.details as object).length > 0;
  
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case LogLevel.INFO:
        return <Info className="h-4 w-4 text-blue-500" />;
      case LogLevel.SUCCESS:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case LogLevel.DEBUG:
        return <Bug className="h-4 w-4 text-purple-500" />;
      case LogLevel.TRACE:
        return <Code className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getBgColorClass = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'border-l-4 border-l-red-500 bg-red-900/10';
      case LogLevel.WARN:
        return 'border-l-4 border-l-yellow-500 bg-yellow-900/10';
      case LogLevel.INFO:
        return 'border-l-4 border-l-blue-500 bg-blue-900/10';
      case LogLevel.SUCCESS:
        return 'border-l-4 border-l-green-500 bg-green-900/10';
      case LogLevel.DEBUG:
        return 'border-l-4 border-l-purple-500 bg-purple-900/10';
      case LogLevel.TRACE:
        return 'border-l-4 border-l-gray-500 bg-gray-900/10';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-900/10';
    }
  };
  
  return (
    <div 
      className={`log-item p-2 mb-1 rounded ${getBgColorClass(log.level)} ${index % 2 === 0 ? 'bg-opacity-50' : ''}`}
      onClick={() => hasDetails && setExpanded(!expanded)}
    >
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">{getLevelIcon(log.level)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-sm">
            <span className="text-xs text-gray-400 mr-2">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className="font-medium">{log.category}</span>
          </div>
          <div className="message-content text-sm">{renderUnknownAsNode(log.message)}</div>
          
          <AnimatePresence>
            {expanded && hasDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <LogDetails details={log.details as Record<string, any> || {}} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {hasDetails && (
          <button 
            className="text-xs text-gray-400 hover:text-white ml-2 mt-1"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
};

export function LogConsole() {
  const { logs, clearLogs } = useLoggingContext();
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const filteredLogs = logs
    .filter(log => filter === 'all' || log.level === filter)
    .filter(log => 
      search === '' || 
      String(log.message).toLowerCase().includes(search.toLowerCase()) ||
      log.category.toLowerCase().includes(search.toLowerCase())
    );
  
  const scrollToBottom = useCallback(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);
  
  useEffect(() => {
    scrollToBottom();
  }, [filteredLogs.length, scrollToBottom]);
  
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-64 bg-gray-900 text-white border-t border-gray-700 overflow-hidden flex flex-col"
    >
      <div className="p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">Console Logs</h3>
          <div className="text-xs text-gray-400">
            {filteredLogs.length} / {logs.length} logs
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 text-xs rounded hover:bg-gray-700"
            onClick={clearLogs}
          >
            Clear
          </button>
          
          <select
            className="bg-gray-800 text-xs rounded px-2 py-1 border border-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogLevel | 'all')}
          >
            <option value="all">All Levels</option>
            <option value={LogLevel.ERROR}>Errors</option>
            <option value={LogLevel.WARN}>Warnings</option>
            <option value={LogLevel.INFO}>Info</option>
            <option value={LogLevel.SUCCESS}>Success</option>
            <option value={LogLevel.DEBUG}>Debug</option>
            <option value={LogLevel.TRACE}>Trace</option>
          </select>
          
          <input
            type="text"
            placeholder="Search logs..."
            className="bg-gray-800 text-xs rounded px-2 py-1 border border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <button 
            className={`flex items-center text-xs px-2 py-1 rounded ${autoScroll ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setAutoScroll(!autoScroll)}
          >
            <ArrowDownCircle className="h-3 w-3 mr-1" />
            Auto-scroll
          </button>
          
          <button 
            className="px-2 py-1 text-xs rounded hover:bg-gray-700"
            onClick={() => {
              const { useLoggingContext } = require('../context/LoggingContext');
              if (useLoggingContext) {
                useLoggingContext().toggleLogConsole();
              }
            }}
          >
            Close
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <LogItem key={log.id} log={log} index={index} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            {logs.length > 0 ? 'No logs match your filters' : 'No logs to display'}
          </div>
        )}
        <div ref={logsEndRef} />
      </div>
    </motion.div>
  );
}
