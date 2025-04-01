import React, { useEffect, useState } from 'react';
import { LogEntry, LogCategory, memoryTransport } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CyberCard } from '@/admin/components/ui/CyberCard';
import { cn } from '@/lib/utils';
import { safelyRenderNode } from '@/shared/utils/react-utils';

export function LogsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [levelStats, setLevelStats] = useState<{ name: string; value: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; value: number }[]>([]);
  const [timeStats, setTimeStats] = useState<{ name: string; count: number }[]>([]);
  
  useEffect(() => {
    const updateStats = () => {
      const allLogs = memoryTransport.getLogs();
      setLogs(allLogs);
      
      const levelCounts: Record<string, number> = {};
      Object.values(LogLevel)
        .filter(level => typeof level === 'string')
        .forEach(level => {
          levelCounts[level] = 0;
        });
      
      allLogs.forEach(log => {
        levelCounts[log.level] = (levelCounts[log.level] || 0) + 1;
      });
      
      setLevelStats(
        Object.entries(levelCounts).map(([name, value]) => ({ name, value }))
      );
      
      const categoryCounts: Record<string, number> = {};
      Object.values(LogCategory).forEach(category => {
        categoryCounts[category] = 0;
      });
      
      allLogs.forEach(log => {
        categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
      });
      
      setCategoryStats(
        Object.entries(categoryCounts)
          .map(([name, value]) => ({ name, value }))
          .filter(({ value }) => value > 0)
      );
      
      const nowTime = new Date();
      const lastHour = new Date(nowTime.getTime() - 60 * 60 * 1000);
      const intervals: Record<string, number> = {};
      
      for (let i = 0; i < 12; i++) {
        const time = new Date(lastHour.getTime() + i * 5 * 60 * 1000);
        const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        intervals[label] = 0;
      }
      
      allLogs.forEach(log => {
        const logTime = new Date(log.timestamp);
        if (logTime >= lastHour && logTime <= nowTime) {
          const minutesSinceLastHour = Math.floor((logTime.getTime() - lastHour.getTime()) / (5 * 60 * 1000));
          const intervalTime = new Date(lastHour.getTime() + minutesSinceLastHour * 5 * 60 * 1000);
          const label = intervalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          intervals[label] = (intervals[label] || 0) + 1;
        }
      });
      
      setTimeStats(
        Object.entries(intervals).map(([name, count]) => ({ name, count }))
      );
    };
    
    updateStats();
    
    const interval = setInterval(updateStats, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const COLORS = ['#00F0FF', '#FF2D6E', '#FFB400', '#00FF9D', '#8B5CF6'];
  
  const LEVEL_COLORS: Record<string, string> = {
    'DEBUG': '#888888',
    'INFO': '#00F0FF',
    'WARNING': '#FFB400',
    'ERROR': '#FF2D6E',
    'CRITICAL': '#FF4136'
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--impulse-text-primary)] mb-4">
        Logs Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Total Logs</div>
          <div className="text-3xl font-bold text-[var(--impulse-primary)]">{logs.length}</div>
        </CyberCard>
        
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Warning+ Logs</div>
          <div className="text-3xl font-bold text-yellow-400">
            {logs.filter(log => log.level >= LogLevel.WARN).length}
          </div>
        </CyberCard>
        
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Error+ Logs</div>
          <div className="text-3xl font-bold text-[var(--impulse-secondary)]">
            {logs.filter(log => log.level >= LogLevel.ERROR).length}
          </div>
        </CyberCard>
      </div>
      
      <CyberCard title="Log Level Distribution" className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={levelStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {levelStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={LEVEL_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} logs`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CyberCard>
      
      <CyberCard title="Log Categories" className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: 'var(--impulse-text-secondary)' }} 
              />
              <YAxis tick={{ fill: 'var(--impulse-text-secondary)' }} />
              <Tooltip 
                formatter={(value) => [`${value} logs`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'var(--impulse-bg-card)', 
                  border: '1px solid var(--impulse-border-normal)',
                  borderRadius: '4px' 
                }} 
              />
              <Bar dataKey="value" name="Count" fill="var(--impulse-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CyberCard>
      
      <CyberCard title="Log Activity (Last Hour)" className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fill: 'var(--impulse-text-secondary)' }} 
              />
              <YAxis tick={{ fill: 'var(--impulse-text-secondary)' }} />
              <Tooltip 
                formatter={(value) => [`${value} logs`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'var(--impulse-bg-card)', 
                  border: '1px solid var(--impulse-border-normal)',
                  borderRadius: '4px' 
                }}
              />
              <Bar dataKey="count" name="Log Count" fill="var(--impulse-secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CyberCard>
      
      <CyberCard title="Recent Logs" className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--impulse-border-normal)]">
                <th className="py-2 px-4 text-left text-[var(--impulse-text-secondary)]">Time</th>
                <th className="py-2 px-4 text-left text-[var(--impulse-text-secondary)]">Level</th>
                <th className="py-2 px-4 text-left text-[var(--impulse-text-secondary)]">Category</th>
                <th className="py-2 px-4 text-left text-[var(--impulse-text-secondary)]">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log) => (
                <tr 
                  key={log.id} 
                  className="border-b border-[var(--impulse-border-normal)] hover:bg-[var(--impulse-bg-overlay)]"
                >
                  <td className="py-2 px-4 text-sm">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-4">
                    <span 
                      className={cn(
                        "px-2 py-1 text-xs rounded-full", 
                        getLevelBadgeClass(log.level)
                      )}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm">{log.category}</td>
                  <td className="py-2 px-4 text-sm truncate max-w-md">
                    {safelyRenderNode(log.message)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}

function getLevelBadgeClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'bg-gray-400/20 text-gray-400';
    case LogLevel.INFO:
      return 'bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]';
    case LogLevel.WARN:
      return 'bg-yellow-400/20 text-yellow-400';
    case LogLevel.ERROR:
      return 'bg-[var(--impulse-secondary)]/20 text-[var(--impulse-secondary)]';
    case LogLevel.CRITICAL:
      return 'bg-red-600/20 text-red-600';
    default:
      return 'bg-gray-400/20 text-gray-400';
  }
}
