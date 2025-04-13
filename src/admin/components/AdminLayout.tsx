import React, { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import AdminTopNav from './navigation/AdminTopNav';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminTopNav />
      <div className="admin-layout-content">
        <AdminSidebar />
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}; 