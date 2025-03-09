
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

// Sample data - in a real app this would come from an API or store
const performanceData = [
  { name: 'Jan', visitors: 400, newUsers: 240, avgTime: 1.4 },
  { name: 'Feb', visitors: 300, newUsers: 139, avgTime: 2.1 },
  { name: 'Mar', visitors: 500, newUsers: 280, avgTime: 1.9 },
  { name: 'Apr', visitors: 780, newUsers: 390, avgTime: 1.3 },
  { name: 'May', visitors: 590, newUsers: 350, avgTime: 1.6 },
  { name: 'Jun', visitors: 690, newUsers: 320, avgTime: 2.0 },
  { name: 'Jul', visitors: 1100, newUsers: 600, avgTime: 1.8 },
];

export const PerformanceMetrics = () => {
  return (
    <Card className="cyber-card border-primary/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Site Performance
        </CardTitle>
        <CardDescription>Visitor metrics over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performanceData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-primary/10" />
              <XAxis 
                dataKey="name" 
                className="text-xs text-muted-foreground" 
              />
              <YAxis className="text-xs text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--primary))', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 0 10px hsla(var(--primary), 0.3)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorVisitors)" 
                strokeWidth={2} 
              />
              <Area 
                type="monotone" 
                dataKey="newUsers" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#colorNewUsers)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
