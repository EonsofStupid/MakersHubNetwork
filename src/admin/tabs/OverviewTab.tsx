
import React from "react";
import { StatsCards } from "@/admin/dashboard/StatsCards";
import { TrendingParts } from "@/admin/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/dashboard/ActiveUsersList";
import { PerformanceMetrics } from "@/admin/dashboard/PerformanceMetrics";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { LayoutDashboard } from "lucide-react";

export const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Dashboard Overview" className="cyber-text-glow" />
        </h2>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics />
        <div className="grid grid-cols-1 gap-6">
          <TrendingParts />
          <ActiveUsersList />
        </div>
      </div>
    </div>
  );
};
