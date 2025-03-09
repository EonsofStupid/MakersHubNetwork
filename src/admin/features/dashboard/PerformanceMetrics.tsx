
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react";

// Sample data for the chart
const dailyData = [
  { name: "Mon", visits: 2400, orders: 1200, revenue: 3200 },
  { name: "Tue", visits: 1398, orders: 900, revenue: 2900 },
  { name: "Wed", visits: 9800, orders: 2900, revenue: 5900 },
  { name: "Thu", visits: 3908, orders: 1900, revenue: 4900 },
  { name: "Fri", visits: 4800, orders: 2200, revenue: 6500 },
  { name: "Sat", visits: 3800, orders: 2100, revenue: 5900 },
  { name: "Sun", visits: 4300, orders: 2300, revenue: 6300 },
];

const weeklyData = [
  { name: "Week 1", visits: 12000, orders: 5400, revenue: 24000 },
  { name: "Week 2", visits: 14000, orders: 6100, revenue: 28000 },
  { name: "Week 3", visits: 15000, orders: 7200, revenue: 33000 },
  { name: "Week 4", visits: 18000, orders: 8900, revenue: 42000 },
];

const monthlyData = [
  { name: "Jan", visits: 45000, orders: 21000, revenue: 93000 },
  { name: "Feb", visits: 42000, orders: 19500, revenue: 88000 },
  { name: "Mar", visits: 50000, orders: 23000, revenue: 102000 },
  { name: "Apr", visits: 58000, orders: 27000, revenue: 118000 },
  { name: "May", visits: 54000, orders: 25000, revenue: 110000 },
  { name: "Jun", visits: 62000, orders: 30000, revenue: 130000 },
];

export const PerformanceMetrics = () => {
  return (
    <Card className="cyber-card border-primary/20 overflow-hidden h-full">
      <CardHeader className="pb-2 relative bg-gradient-to-r from-primary/20 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="bg-background/50 border border-primary/10">
            <TabsTrigger 
              value="daily"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger 
              value="weekly"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger 
              value="monthly"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Monthly
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--primary)',
                    borderRadius: '6px',
                    opacity: 0.9
                  }} 
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                  activeDot={{ r: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--secondary)"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weekly" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisitsWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrdersWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--primary)',
                    borderRadius: '6px',
                    opacity: 0.9
                  }} 
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorVisitsWeekly)"
                  activeDot={{ r: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--secondary)"
                  fillOpacity={1}
                  fill="url(#colorOrdersWeekly)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisitsMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrdersMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--primary)',
                    borderRadius: '6px',
                    opacity: 0.9
                  }} 
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorVisitsMonthly)"
                  activeDot={{ r: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--secondary)"
                  fillOpacity={1}
                  fill="url(#colorOrdersMonthly)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
