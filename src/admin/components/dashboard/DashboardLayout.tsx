
import React from 'react';
import { AdminSection } from '../layout/AdminSection';
import { AdminGrid } from '../layout/AdminGrid';
import { BuildApprovalWidget } from './BuildApprovalWidget';
import { StatsCards } from './StatsCards';
import { AdminFeatureSection } from './AdminFeatureSection';
import { DashboardShortcuts } from './DashboardShortcuts';

/**
 * Default dashboard layout when no layout is defined in the database
 */
export function DashboardLayout() {
  return (
    <div className="space-y-6">
      <AdminSection>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the MakersImpulse admin dashboard. 
          This is the fallback layout when no custom layout is defined.
        </p>
      </AdminSection>
      
      <AdminSection>
        <DashboardShortcuts />
      </AdminSection>
      
      <AdminGrid columns={2} gap={6}>
        <BuildApprovalWidget />
        <StatsCards />
      </AdminGrid>
      
      <AdminFeatureSection />
    </div>
  );
}
