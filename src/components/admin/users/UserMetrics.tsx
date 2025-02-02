import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck } from "lucide-react";

interface MetricsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
}

export const UserMetrics = ({ data }: { data: MetricsData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
          <Users className="h-4 w-4 text-[#41f0db]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{data.totalUsers}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">New Users (30d)</CardTitle>
          <UserPlus className="h-4 w-4 text-[#ff0abe]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{data.newUsers}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Active Users (7d)</CardTitle>
          <UserCheck className="h-4 w-4 text-[#8000ff]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{data.activeUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
};