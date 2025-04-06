
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function DashboardOverview() {
  const logger = useLogger('DashboardOverview', LogCategory.ADMIN);

  React.useEffect(() => {
    logger.info('Dashboard overview component mounted');
    return () => {
      logger.info('Dashboard overview component unmounted');
    };
  }, [logger]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">127</p>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <p className="text-sm">All systems operational</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">24 actions in the last hour</p>
          <p className="text-xs text-muted-foreground mt-2">Last updated 5 minutes ago</p>
        </CardContent>
      </Card>
    </div>
  );
}
