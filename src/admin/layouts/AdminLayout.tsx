
import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AdminLayout({ children, sidebarOpen, onToggleSidebar }: AdminLayoutProps) {
  return (
    <div className="impulse-admin-root flex h-screen bg-[var(--impulse-bg-main)]">
      <AdminSidebar open={sidebarOpen} onToggle={onToggleSidebar} />
      <div className="flex flex-col flex-1 h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}
