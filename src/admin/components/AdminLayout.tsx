
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAdminStore } from '../store/admin.store';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { Spinner } from '@/shared/ui/spinner';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { hasRole } = useAdminPermissions();
  
  useEffect(() => {
    // Redirect if not authenticated or doesn't have admin role
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login?redirect=/admin');
    } else if (!isLoading && isAuthenticated && !hasRole(['ADMIN', 'SUPERADMIN'])) {
      navigate('/admin/unauthorized');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
