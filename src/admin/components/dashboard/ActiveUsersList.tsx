
import React from 'react';

export interface ActiveUsersListProps {
  className?: string;
}

export function ActiveUsersList({ className = '' }: ActiveUsersListProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-2">Active Users</h3>
      <p className="text-sm text-muted-foreground">No active users</p>
    </div>
  );
}

export default ActiveUsersList;
