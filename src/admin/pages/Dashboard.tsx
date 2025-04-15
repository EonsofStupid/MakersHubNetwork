
import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 cyber-text">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Users" 
          value="2,543" 
          change="+12%" 
          icon="👤" 
        />
        <DashboardCard 
          title="Builds" 
          value="1,892" 
          change="+23%" 
          icon="🖨️" 
        />
        <DashboardCard 
          title="Revenue" 
          value="$12,450" 
          change="+8%" 
          icon="💰" 
        />
      </div>
      
      <div className="bg-black/20 p-6 rounded-xl border border-primary/20 mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-primary/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    👤
                  </div>
                  <div>
                    <p className="font-medium">User #{i} performed an action</p>
                    <p className="text-sm text-muted-foreground">Just now</p>
                  </div>
                </div>
                <button className="text-sm text-primary">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

function DashboardCard({ title, value, change, icon }: DashboardCardProps) {
  return (
    <div className="bg-black/20 p-6 rounded-xl border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-green-500">{change}</p>
      </div>
    </div>
  );
}
