
import React from "react";
import { Card } from '@/ui/core/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/core/tabs';
import { BarChart, LineChart, PieChart, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Page Views</h3>
            <TrendingUp className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">24,853</p>
          <span className="text-xs text-primary">+18% from last month</span>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Unique Visitors</h3>
            <TrendingUp className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">9,471</p>
          <span className="text-xs text-primary">+12% from last month</span>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
            <TrendingUp className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">68%</p>
          <span className="text-xs text-primary">+5% from last month</span>
        </Card>
      </div>
      
      <Tabs defaultValue="traffic">
        <TabsList>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Traffic Analytics</h2>
            </div>
            <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Traffic chart visualization coming soon</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Engagement Metrics</h2>
            </div>
            <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Engagement metrics visualization coming soon</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Conversion Analytics</h2>
            </div>
            <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Conversion analytics visualization coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
