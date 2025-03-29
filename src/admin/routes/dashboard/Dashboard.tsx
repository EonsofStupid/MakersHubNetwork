
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Here's a snapshot of your platform's current status
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">257</div>
              <div className="text-sm text-muted-foreground">Builds Created</div>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-muted-foreground">Builds Pending</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
