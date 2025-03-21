
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/admin/dashboard/StatsCards";
import { TrendingParts } from "@/admin/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/dashboard/ActiveUsersList";

const OverviewDashboard = () => {
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

export default OverviewDashboard;
