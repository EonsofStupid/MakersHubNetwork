
import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

export default function Admin() {
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to the Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage and monitor your MakersImpulse platform.
        </p>
      </div>
    </AdminLayout>
  );
}
