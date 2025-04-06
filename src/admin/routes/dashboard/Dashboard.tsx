
import React, { useEffect, useState } from "react";
import { PageLayout } from "@/admin/components/layouts/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/admin/components/dashboard/DashboardOverview";
import { MetricsPanel } from "@/admin/components/dashboard/MetricsPanel";
import { ActivityFeed } from "@/admin/components/dashboard/ActivityFeed";
import { PermissionChecker, AdminPermissionValue } from "@/admin/components/auth/PermissionChecker";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const logger = useLogger("Dashboard", LogCategory.ADMIN);
  const greeting = getGreeting();

  useEffect(() => {
    logger.info("Dashboard mounted", {
      details: { activeTab }
    });

    return () => {
      logger.info("Dashboard unmounted");
    };
  }, [logger, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    logger.info("Dashboard tab changed", {
      details: { tab }
    });
  };

  return (
    <PageLayout title="Dashboard">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {greeting}, Admin
            </h2>
            <p className="text-muted-foreground">
              Here's a snapshot of your application's performance.
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="metrics">
            <PermissionChecker permission={AdminPermissionValue.ViewMetrics}>
              <MetricsPanel />
            </PermissionChecker>
          </TabsContent>
          
          <TabsContent value="activity">
            <PermissionChecker permission={AdminPermissionValue.ViewActivity}>
              <ActivityFeed />
            </PermissionChecker>
          </TabsContent>
          
          <TabsContent value="settings">
            <PermissionChecker permission={AdminPermissionValue.ManageSettings}>
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium">Dashboard Settings</h3>
                <p className="text-muted-foreground">
                  Configure your dashboard preferences.
                </p>
                <div className="mt-4">
                  <p>Settings content goes here</p>
                </div>
              </div>
            </PermissionChecker>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
