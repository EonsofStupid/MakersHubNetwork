
import React from 'react';
import { StatsCards } from './StatsCards';
import { BuildApprovalWidget } from './BuildApprovalWidget';
import { DashboardShortcuts } from './DashboardShortcuts';
import { AdminSection } from '../layout/AdminSection';
import { AdminGrid } from '../layout/AdminGrid';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';

export function AdminDashboard() {
  const { hasPermission } = useAdminPermissions();
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      
      <AdminSection title="Overview">
        <StatsCards />
      </AdminSection>
      
      <AdminGrid columns={2}>
        <AdminSection title="Quick Actions">
          <DashboardShortcuts />
        </AdminSection>
        
        <AdminSection title="Build Approval">
          <BuildApprovalWidget />
        </AdminSection>
      </AdminGrid>
    </div>
  );
}
