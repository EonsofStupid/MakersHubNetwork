
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Settings, Package, LayoutDashboard, PlusCircle } from 'lucide-react';

interface DashboardShortcutsProps {
  className?: string;
}

export function DashboardShortcuts({ className = '' }: DashboardShortcutsProps) {
  const shortcuts = [
    {
      name: 'Users',
      description: 'Manage user accounts',
      icon: <Users className="h-5 w-5" />,
      link: '/admin/users',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      name: 'Content',
      description: 'Edit site content',
      icon: <FileText className="h-5 w-5" />,
      link: '/admin/content',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      name: 'Builds',
      description: 'Review printer builds',
      icon: <Package className="h-5 w-5" />,
      link: '/admin/builds',
      color: 'bg-orange-500/10 text-orange-500'
    },
    {
      name: 'Settings',
      description: 'Configure system',
      icon: <Settings className="h-5 w-5" />,
      link: '/admin/settings',
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shortcuts.map((shortcut, index) => (
          <Link
            key={index}
            to={shortcut.link}
            className="group flex flex-col space-y-2 rounded-lg border border-[var(--impulse-border)] p-4 hover:bg-[var(--impulse-bg-hover)] transition-colors"
          >
            <div className={`rounded-full ${shortcut.color} p-2 w-fit`}>
              {shortcut.icon}
            </div>
            <div>
              <h3 className="font-medium text-[var(--impulse-text-primary)] group-hover:text-[var(--impulse-primary)]">
                {shortcut.name}
              </h3>
              <p className="text-sm text-[var(--impulse-text-secondary)]">
                {shortcut.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center">
        <button className="flex items-center space-x-1 text-sm text-[var(--impulse-primary)] hover:text-[var(--impulse-primary-hover)]">
          <PlusCircle className="h-4 w-4" />
          <span>Add Shortcut</span>
        </button>
      </div>
    </div>
  );
}
