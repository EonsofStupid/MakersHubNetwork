
import React from 'react';
import { Users, Box, FileCheck, Eye } from 'lucide-react';

export function StatsCards() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,853',
      change: '+12.5%',
      icon: <Users className="h-4 w-4" />,
      trend: 'up'
    },
    {
      title: 'Active Builds',
      value: '245',
      change: '+4.3%',
      icon: <Box className="h-4 w-4" />,
      trend: 'up'
    },
    {
      title: 'Pending Approvals',
      value: '12',
      change: '-2',
      icon: <FileCheck className="h-4 w-4" />,
      trend: 'down'
    },
    {
      title: 'Total Views',
      value: '45.2K',
      change: '+18.7%',
      icon: <Eye className="h-4 w-4" />,
      trend: 'up'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-[var(--impulse-border)] bg-[var(--impulse-bg-card)] p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-[var(--impulse-text-secondary)]">{stat.title}</div>
            <div className="rounded-full bg-[var(--impulse-bg-muted)] p-1.5 text-[var(--impulse-primary)]">
              {stat.icon}
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[var(--impulse-text-primary)]">{stat.value}</div>
          <div className={`mt-1 text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {stat.change} from last month
          </div>
        </div>
      ))}
    </div>
  );
}
