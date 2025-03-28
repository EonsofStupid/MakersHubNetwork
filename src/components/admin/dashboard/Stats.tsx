
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UsersIcon, PackageIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Users"
        value="1,245"
        trend="+12%"
        trendUp={true}
        icon={<UsersIcon className="w-5 h-5" />}
        color="bg-blue-500/10 text-blue-500"
      />
      
      <StatCard 
        title="Active Builds"
        value="386"
        trend="+24%"
        trendUp={true}
        icon={<PackageIcon className="w-5 h-5" />}
        color="bg-green-500/10 text-green-500"
      />
      
      <StatCard 
        title="Active Makers"
        value="89"
        trend="+5%"
        trendUp={true}
        icon={<ActivityIcon className="w-5 h-5" />}
        color="bg-purple-500/10 text-purple-500"
      />
      
      <StatCard 
        title="Engagement"
        value="45.2%"
        trend="-3%"
        trendUp={false}
        icon={<TrendingUpIcon className="w-5 h-5" />}
        color="bg-amber-500/10 text-amber-500"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, trend, trendUp, icon, color }: StatCardProps) {
  return (
    <Card className="border border-primary/10 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            <div className={`mt-1 text-xs font-medium inline-flex items-center ${
              trendUp ? 'text-green-500' : 'text-red-500'
            }`}>
              {trendUp ? (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {trend} this month
            </div>
          </div>
          
          <div className={`${color} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
