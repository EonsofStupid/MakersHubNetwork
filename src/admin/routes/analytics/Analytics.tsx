
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/core/card";
import { BarChart } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Visualize your platform's metrics and performance data
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <div className="text-2xl font-bold">257</div>
              <div className="text-sm text-muted-foreground">Builds Created</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
