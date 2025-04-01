
import React from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";

export default function UsersPage() {
  return (
    <AdminLayout title="Users Management">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">
          Manage your users here. This page is under construction.
        </p>
      </div>
    </AdminLayout>
  );
}
