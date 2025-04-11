
import React, { useState } from 'react';
import { LogCategory } from '@/logging';
import { LogActivityStream } from '@/admin/components/ui/LogActivityStream';
import { LogLevel } from '@/logging/constants/log-level';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { renderUnknownAsNode } from '@/shared/utils/render';

/**
 * LogsDashboard component
 * Displays a dashboard with log activity streams
 */
export function LogsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>(LogLevel.INFO);
  
  const categories: (LogCategory | 'all')[] = [
    'all',
    LogCategory.ADMIN,
    LogCategory.AUTH,
    LogCategory.SYSTEM,
    LogCategory.UI,
    LogCategory.API,
    LogCategory.CHAT,
    LogCategory.DATABASE
  ];
  
  const levels: LogLevel[] = [
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
    LogLevel.CRITICAL
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Logs</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={selectedLevel}
            onValueChange={(value) => setSelectedLevel(value as LogLevel)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as LogCategory | 'all')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {renderUnknownAsNode(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <LogActivityStream
          height="400px"
          level={selectedLevel}
          categories={selectedCategory === 'all' ? undefined : [selectedCategory as LogCategory]}
          showSource={true}
          maxEntries={100}
        />
      </CardContent>
    </Card>
  );
}
