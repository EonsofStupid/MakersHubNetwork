
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/core/card';
import { Users, Package, Calendar, Drill, Wrench, ShoppingCart } from "lucide-react";

export function Stats() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <CardDescription>Platform registered makers</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+24% </span>
            from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-sm font-medium">Builds</CardTitle>
            <CardDescription>Submitted printer builds</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">386</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+12% </span>
            from last month
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-md border border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-sm font-medium">Active Makers</CardTitle>
            <CardDescription>Active in last 30 days</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+8% </span>
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
