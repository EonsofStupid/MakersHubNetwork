
import React from 'react';

export interface StatsCardsProps {
  className?: string;
}

export function StatsCards({ className = '' }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
      <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Active Sessions</h3>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
      <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
    </div>
  );
}

export default StatsCards;
