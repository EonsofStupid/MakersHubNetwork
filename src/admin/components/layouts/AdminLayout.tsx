
import React from 'react';
import AdminSidebar from '../AdminSidebar';
import { cn } from '@/shared/utils/cn';

export interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  fullWidth = false, 
  className,
  title
}) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        fullWidth ? "max-w-full" : "max-w-7xl mx-auto",
        className
      )}>
        {title && (
          <header className="border-b py-4 px-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </header>
        )}
        
        <main className="flex-1 p-6">
          {children}
        </main>
        
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          Admin Panel © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
