
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BuildApprovalWidget } from '@/components/admin/dashboard/BuildApprovalWidget';
import { AdminFeatureSection } from '@/components/admin/dashboard/AdminFeatureSection';
import { StatsCards } from '@/admin/dashboard/StatsCards';

/**
 * Default fallback dashboard layout when no database layout is available
 */
export function DashboardLayout() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      {/* Dashboard Shortcuts and Stats */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <BuildApprovalWidget />
          </div>
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
            <StatsCards minimal />
          </Card>
        </div>
        
        <div className="mt-6">
          <AdminFeatureSection />
        </div>
      </div>
    </div>
  );
}
