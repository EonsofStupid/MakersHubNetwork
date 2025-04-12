
import React from 'react';

interface DashboardShortcutsProps {
  className?: string;
}

export function DashboardShortcuts({ className }: DashboardShortcutsProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ShortcutCard title="Users" subtitle="Manage users" href="/admin/users" />
        <ShortcutCard title="Content" subtitle="Manage content" href="/admin/content" />
        <ShortcutCard title="Settings" subtitle="System settings" href="/admin/settings" />
        <ShortcutCard title="Logs" subtitle="System logs" href="/admin/logs" />
      </div>
    </div>
  );
}

interface ShortcutCardProps {
  title: string;
  subtitle: string;
  href: string;
}

function ShortcutCard({ title, subtitle, href }: ShortcutCardProps) {
  return (
    <a 
      href={href} 
      className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
    </a>
  );
}
