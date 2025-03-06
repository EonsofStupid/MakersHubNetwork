
import React from "react";
import { StatsCards } from "@/admin/components/dashboard/StatsCards";
import { TrendingParts } from "@/admin/components/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/components/dashboard/ActiveUsersList";
import { Card } from "@/components/ui/card";

const OverviewPage = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-card border-primary/20 p-6">
        <h2 className="text-2xl font-heading cyber-text-glow">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">Welcome to the MakersImpulse admin dashboard</p>
      </Card>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingParts />
        <ActiveUsersList />
      </div>
    </div>
  );
};

export default OverviewPage;
