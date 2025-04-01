
import React from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";

export default function SettingsPage() {
  return (
    <AdminLayout title="Admin Settings">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure your admin panel settings here. This page is under construction.
        </p>
      </div>
    </AdminLayout>
  );
}
