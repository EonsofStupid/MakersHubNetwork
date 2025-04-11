
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/core/card";

export function PerformanceMetrics() {
  return (
    <Card className="cyber-card border-primary/20">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>System performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-primary/20 rounded-md">
          <p className="text-muted-foreground">Performance chart will appear here</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Response Time</p>
            <p className="text-lg font-semibold">245ms</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Server Load</p>
            <p className="text-lg font-semibold">23%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Memory Usage</p>
            <p className="text-lg font-semibold">1.2GB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
