import React, { useState, useEffect } from 'react';
import { safeGetLogs, getLogsByLevel, getLogsByCategory, getErrorLogs } from '@/logging/utils/memoryTransportHelper';
import { LogLevel, LogCategory } from '@/logging/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLogger } from '@/hooks/use-logger';

/**
 * Dashboard widget for displaying recent logs
 */
export function LogsDashboard() {
  const [totalLogs, setTotalLogs] = useState(0);
  const [traceLogs, setTraceLogs] = useState(0);
  const [debugLogs, setDebugLogs] = useState(0);
  const [infoLogs, setInfoLogs] = useState(0);
  const [warnLogs, setWarnLogs] = useState(0);
  const [errorLogs, setErrorLogs] = useState(0);
  const [fatalLogs, setFatalLogs] = useState(0);
  const [systemLogs, setSystemLogs] = useState(0);
  const [authLogs, setAuthLogs] = useState(0);
  const [adminLogs, setAdminLogs] = useState(0);
  const [errorCategoryLogs, setErrorCategoryLogs] = useState(0);
  
  const logger = useLogger('LogsDashboard');
  
  useEffect(() => {
    // Fetch log counts from memory transport
    const allLogs = safeGetLogs();
    setTotalLogs(allLogs.length);
    setTraceLogs(getLogsByLevel(LogLevel.TRACE).length);
    setDebugLogs(getLogsByLevel(LogLevel.DEBUG).length);
    setInfoLogs(getLogsByLevel(LogLevel.INFO).length);
    setWarnLogs(getLogsByLevel(LogLevel.WARN).length);
    setErrorLogs(getLogsByLevel(LogLevel.ERROR).length);
    setFatalLogs(getLogsByLevel(LogLevel.FATAL).length);
    setSystemLogs(getLogsByCategory(LogCategory.SYSTEM).length);
    setAuthLogs(getLogsByCategory(LogCategory.AUTHENTICATION).length);
    setAdminLogs(getLogsByCategory(LogCategory.ADMIN).length);
    setErrorCategoryLogs(getErrorLogs().length);
    
    logger.debug('Log counts updated');
  }, []);
  
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 pb-4">
        <ScrollArea className="h-[300px] w-full pr-2">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span>Total Logs:</span>
              <Badge variant="secondary">{totalLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Trace Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.TRACE)}>{traceLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Debug Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.DEBUG)}>{debugLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Info Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.INFO)}>{infoLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Warn Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.WARN)}>{warnLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Error Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.ERROR)}>{errorLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fatal/Critical Logs:</span>
              <Badge className={getLogSeverityClass(LogLevel.FATAL)}>{fatalLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>System Logs:</span>
              <Badge variant="outline">{systemLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth Logs:</span>
              <Badge variant="outline">{authLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin Logs:</span>
              <Badge variant="outline">{adminLogs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Error Category Logs:</span>
              <Badge variant="destructive">{errorCategoryLogs}</Badge>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to determine log severity class
 */
function getLogSeverityClass(level: LogLevel): string {
  if (level === LogLevel.TRACE) {
    return 'bg-gray-100 text-gray-800';
  } else if (level === LogLevel.DEBUG) {
    return 'bg-gray-200 text-gray-800';
  } else if (level === LogLevel.INFO) {
    return 'bg-blue-100 text-blue-800';
  } else if (level === LogLevel.WARN) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (level === LogLevel.ERROR) {
    return 'bg-red-100 text-red-800';
  } else if (level === LogLevel.FATAL || level === LogLevel.CRITICAL) {
    return 'bg-red-200 text-red-900 font-bold';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
}
