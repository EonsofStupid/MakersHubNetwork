
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)]">
          <h3 className="text-sm font-medium text-[var(--impulse-text-secondary)]">Welcome</h3>
          <p className="mt-2 text-2xl font-bold text-[var(--impulse-text-primary)]">
            {user?.email?.split('@')[0] || 'Admin'}
          </p>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="p-4 border border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)]">
          <h3 className="text-lg font-medium text-[var(--impulse-text-primary)] mb-4">
            Admin Dashboard
          </h3>
          <p className="text-[var(--impulse-text-secondary)]">
            This is your admin dashboard. You can manage your site content, users, and settings here.
          </p>
        </Card>
      </div>
    </div>
  );
}
