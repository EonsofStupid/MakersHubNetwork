
import React from 'react';

export function ActiveUsersList() {
  return (
    <div className="glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)] h-full">
      <h2 className="font-medium text-lg mb-3">Active Users</h2>
      <div className="space-y-3">
        <ActiveUser name="John Doe" role="Admin" timeActive="2h 15m" />
        <ActiveUser name="Jane Smith" role="Editor" timeActive="45m" />
        <ActiveUser name="Alex Johnson" role="Viewer" timeActive="10m" />
        <ActiveUser name="Sarah Williams" role="Editor" timeActive="1h 05m" />
      </div>
    </div>
  );
}

interface ActiveUserProps {
  name: string;
  role: string;
  timeActive: string;
}

function ActiveUser({ name, role, timeActive }: ActiveUserProps) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-[var(--impulse-bg-hover)] rounded-md transition-colors">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium mr-3">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-[var(--impulse-text-secondary)]">{role}</div>
        </div>
      </div>
      <div className="text-xs text-[var(--impulse-text-secondary)]">
        {timeActive}
      </div>
    </div>
  );
}
