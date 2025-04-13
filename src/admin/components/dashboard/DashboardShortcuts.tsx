
import React from 'react';
import { Link } from 'react-router-dom';

export interface DashboardShortcutsProps {
  className?: string;
}

export function DashboardShortcuts({ className = '' }: DashboardShortcutsProps) {
  const shortcuts = [
    { label: 'User Management', path: '/admin/users', description: 'Manage user accounts' },
    { label: 'Content Management', path: '/admin/content', description: 'Manage site content' },
    { label: 'Settings', path: '/admin/settings', description: 'System configuration' },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.path}
          to={shortcut.path}
          className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
        >
          <h3 className="font-medium">{shortcut.label}</h3>
          <p className="text-sm text-muted-foreground">{shortcut.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default DashboardShortcuts;
