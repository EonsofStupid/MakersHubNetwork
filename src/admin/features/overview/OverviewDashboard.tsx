
import React from 'react';
import { Activity, Users, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/shared/utils/cn';
import { useToast } from '@/shared/hooks/use-toast';
import { CyberCard } from '@/shared/ui/cyber-card';

// Sample data for charts
const usageData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 350 },
  { name: 'Fri', value: 450 },
  { name: 'Sat', value: 300 },
  { name: 'Sun', value: 250 },
];

export function OverviewDashboard() {
  const { toast } = useToast();

  const showFeatureToast = () => {
    toast({
      title: 'Coming Soon',
      description: 'This feature is under development.',
    });
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's an overview of your system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-background/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,257</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-background/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Usage</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345 MB</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-background/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Actions in the past 24h
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-background/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Changes this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className={cn(
          "col-span-4 border-primary/20",
          "bg-background/60 backdrop-blur-md"
        )}>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15,15,15,0.8)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    borderRadius: '4px',
                  }}
                />
                <Bar dataKey="value" fill="rgba(0, 240, 255, 0.6)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className={cn(
          "col-span-3 border-primary/20",
          "bg-background/60 backdrop-blur-md"
        )}>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">CPU</span>
                  <span className="text-xl font-bold">24%</span>
                </div>
                <div className="col-span-1 flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Memory</span>
                  <span className="text-xl font-bold">512MB</span>
                </div>
                <div className="col-span-1 flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Storage</span>
                  <span className="text-xl font-bold">1.2GB</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    System Health
                  </span>
                  <span className="text-xs font-medium text-green-500">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Last Backup
                  </span>
                  <span className="text-xs font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    API Status
                  </span>
                  <span className="text-xs font-medium text-green-500">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CyberCard className="border-primary/20 bg-background/60 backdrop-blur-md p-4">
        <h3 className="text-xl font-bold mb-3">Latest Updates</h3>
        <div className="text-sm text-muted-foreground">
          Your system is up to date. No pending actions required.
        </div>
      </CyberCard>
    </div>
  );
}
