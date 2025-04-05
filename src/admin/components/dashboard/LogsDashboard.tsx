
import React, { useEffect, useState } from 'react';
import { LogEntry, LogCategory, memoryTransport } from '@/logging';
import { LogLevel } from '@/logging/constants/log-level';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CyberCard } from '@/admin/components/ui/CyberCard';
import { cn } from '@/lib/utils';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { LogActivityStream } from '@/admin/components/ui/LogActivityStream';

export function LogsDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [levelStats, setLevelStats] = useState<{ name: string; value: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; value: number }[]>([]);
  const [timeStats, setTimeStats] = useState<{ name: string; count: number }[]>([]);
  
  // Update logs and stats
  useEffect(() => {
    const updateStats = () => {
      const allLogs = memoryTransport.getLogs();
      setLogs(allLogs);
      
      // Calculate level stats
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
      
      // Calculate category stats
      const categoryCounts: Record<string, number> = {};
      Object.values(LogCategory).forEach(category => {
        categoryCounts[category] = 0;
      });
      
      allLogs.forEach(log => {
        if (log.category) {
          categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
        }
      });
      
      setCategoryStats(
        Object.entries(categoryCounts)
          .map(([name, value]) => ({ name, value }))
          .filter(({ value }) => value > 0)
      );
      
      // Calculate time-based stats (last hour by 5 min intervals)
      const nowTime = new Date();
      const lastHour = new Date(nowTime.getTime() - 60 * 60 * 1000);
      const intervals: Record<string, number> = {};
      
      // Create 12 5-minute intervals
      for (let i = 0; i < 12; i++) {
        const time = new Date(lastHour.getTime() + i * 5 * 60 * 1000);
        const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        intervals[label] = 0;
      }
      
      allLogs.forEach(log => {
        const logTime = new Date(log.timestamp);
        if (logTime >= lastHour && logTime <= nowTime) {
          // Find which 5-min interval this belongs to
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
    
    // Update every 10 seconds
    const interval = setInterval(updateStats, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  // Colors for charts
  const COLORS = ['#00F0FF', '#FF2D6E', '#FFB400', '#00FF9D', '#8B5CF6'];
  
  // Level colors
  const LEVEL_COLORS: Record<string, string> = {
    'debug': '#888888',
    'info': '#00F0FF',
    'warn': '#FFB400',
    'error': '#FF2D6E',
    'critical': '#FF4136'
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Total Logs</div>
          <div className="text-3xl font-bold text-[var(--impulse-primary)]">{logs.length}</div>
        </CyberCard>
        
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Warning+ Logs</div>
          <div className="text-3xl font-bold text-yellow-400">
            {logs.filter(log => log.level === LogLevel.WARN || log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL).length}
          </div>
        </CyberCard>
        
        <CyberCard className="p-4">
          <div className="text-lg font-medium mb-2">Error+ Logs</div>
          <div className="text-3xl font-bold text-[var(--impulse-secondary)]">
            {logs.filter(log => log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL).length}
          </div>
        </CyberCard>
      </div>
      
      {/* Log Level Distribution */}
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
      
      {/* Log Categories Distribution */}
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
      
      {/* Log Activity Timeline */}
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
      
      {/* Recent Logs Table */}
      <CyberCard title="Recent Logs" className="p-4">
        <LogActivityStream 
          height="400px"
          maxEntries={10}
          showSource={true}
        />
      </CyberCard>
    </div>
  );
}

export default LogsDashboard;
