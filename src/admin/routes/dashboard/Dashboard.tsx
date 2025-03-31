
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { BuildApprovalWidget } from "@/components/admin/dashboard/BuildApprovalWidget";
import { AdminFeatureSection } from "@/components/admin/dashboard/AdminFeatureSection";
import { DashboardShortcuts } from "@/admin/components/dashboard/DashboardShortcuts";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdminStore } from "@/admin/store/admin.store";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();
  const { initializeStore, hasInitialized } = useAdminStore();
  const navigate = useNavigate();
  
  // Initialize admin store if it hasn't been initialized yet
  useEffect(() => {
    if (isAuthenticated && hasAdminAccess && !hasInitialized) {
      initializeStore();
    }
  }, [isAuthenticated, hasAdminAccess, hasInitialized, initializeStore]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !hasAdminAccess) {
      navigate('/admin/unauthorized');
    }
  }, [isAuthenticated, hasAdminAccess, navigate]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      {/* Dashboard Shortcuts - Draggable area */}
      <DashboardShortcuts />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BuildApprovalWidget />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted/50">
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </Card>
              
              <Card className="p-4 bg-muted/50">
                <div className="text-2xl font-bold">257</div>
                <div className="text-sm text-muted-foreground">Total Builds</div>
              </Card>
              
              <Card className="p-4 bg-muted/50">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </Card>
              
              <Card className="p-4 bg-muted/50">
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AdminFeatureSection />
    </div>
  );
}
