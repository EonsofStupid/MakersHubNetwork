
import React from 'react';
import { AdminAuthGuard } from '../panels/auth/AdminAuthGuard';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';

export default function AdminDashboard() {
  const user = useAuthStore(state => state.user);
  const roles = useAuthStore(state => state.roles);
  
  return (
    <AdminAuthGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
              <p><strong>ID:</strong> {user?.id}</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Roles & Permissions</h2>
            <div className="space-y-2">
              <p><strong>Roles:</strong> {roles.join(', ')}</p>
              <p><strong>Is Admin:</strong> {RBACBridge.hasAdminAccess() ? 'Yes' : 'No'}</p>
              <p><strong>Is Super Admin:</strong> {RBACBridge.isSuperAdmin() ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded w-full">
                View Users
              </button>
              <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded w-full">
                View Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
