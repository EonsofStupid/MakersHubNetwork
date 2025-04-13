
import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  return (
    <div className={cn("w-64 h-screen bg-background border-r", className)}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">Admin</h2>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="flex items-center p-2 rounded-md hover:bg-muted">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/users" className="flex items-center p-2 rounded-md hover:bg-muted">
                Users
              </a>
            </li>
            <li>
              <a href="/admin/content" className="flex items-center p-2 rounded-md hover:bg-muted">
                Content
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-muted">
                Settings
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <span className="text-sm text-muted-foreground">Admin v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
