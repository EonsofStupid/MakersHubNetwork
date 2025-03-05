
import React from "react";
import { StatsCards } from "@/admin/components/dashboard/StatsCards";
import { TrendingParts } from "@/admin/components/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/components/dashboard/ActiveUsersList";

export const OverviewTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Dashboard Overview</h2>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingParts />
        <ActiveUsersList />
      </div>
    </div>
  );
};
