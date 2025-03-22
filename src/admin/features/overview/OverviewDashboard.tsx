
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, UserRoundPlus, Users, CircleDollarSign, Printer3d } from "lucide-react";
import { CyberText } from "@/components/theme/CyberText";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  loading?: boolean;
}

const StatCard = ({ title, value, description, icon, trend, loading }: StatCardProps) => (
  <Card className="cyber-card">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading ? (
          <div className="h-8 w-24 animate-pulse bg-primary/10 rounded"></div>
        ) : (
          <CyberText variant="glitch">{value}</CyberText>
        )}
      </div>
      <p className="text-xs text-muted-foreground pt-1">
        {description}
        {trend !== undefined && (
          <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
            {" "}
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </p>
    </CardContent>
  </Card>
);

export default function OverviewDashboard() {
  const { toast } = useToast();
  
  // Simulate data loading with React Query
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        totalUsers: 1248,
        newUsers: 36,
        totalFiles: 4205,
        activeSessions: 114,
        totalPrinters: 567
      };
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Tabs defaultValue="today" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : stats?.totalUsers.toString() || "0"}
          description="Total registered users"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={12}
          loading={isLoading}
        />
        <StatCard
          title="New Users"
          value={isLoading ? "..." : stats?.newUsers.toString() || "0"}
          description="New users this period"
          icon={<UserRoundPlus className="h-4 w-4 text-muted-foreground" />}
          trend={8}
          loading={isLoading}
        />
        <StatCard
          title="Active Sessions"
          value={isLoading ? "..." : stats?.activeSessions.toString() || "0"}
          description="Users currently online"
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          trend={-3}
          loading={isLoading}
        />
        <StatCard
          title="Printer Models"
          value={isLoading ? "..." : stats?.totalPrinters.toString() || "0"}
          description="Registered 3D printer models"
          icon={<Printer3d className="h-4 w-4 text-muted-foreground" />}
          trend={5}
          loading={isLoading}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="cyber-card col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              User engagement metrics from the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-primary/20 rounded-md">
                <p className="text-muted-foreground">Chart will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="cyber-card col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-primary/10 rounded animate-pulse"></div>
                      <div className="h-3 bg-primary/5 rounded animate-pulse w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex gap-2 items-start">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">User Registration</p>
                    <p className="text-xs text-muted-foreground">
                      New user registered as a maker
                    </p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-start">
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CircleDollarSign className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Model Uploaded</p>
                    <p className="text-xs text-muted-foreground">
                      New 3D model uploaded by a user
                    </p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
