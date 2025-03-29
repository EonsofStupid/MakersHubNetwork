
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, Package, BarChart, FileText } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
            <UsersIcon className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">1,245</p>
          <span className="text-xs text-primary">+12% from last month</span>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Builds</h3>
            <Package className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">386</p>
          <span className="text-xs text-primary">+7% from last month</span>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Content Pieces</h3>
            <FileText className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">127</p>
          <span className="text-xs text-primary">+15% from last month</span>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
            <BarChart className="h-4 w-4 text-primary/70" />
          </div>
          <p className="text-2xl font-semibold">89</p>
          <span className="text-xs text-primary">+5% from last week</span>
        </Card>
      </div>
      
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="builds">Recent Builds</TabsTrigger>
          <TabsTrigger value="content">Recent Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-start space-x-4 border-b border-border pb-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">User registered</p>
                    <p className="text-sm text-muted-foreground">New user joined the platform</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="builds">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Builds</h2>
            <p className="text-muted-foreground">Recent builds will be displayed here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
            <p className="text-muted-foreground">Recent content will be displayed here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
