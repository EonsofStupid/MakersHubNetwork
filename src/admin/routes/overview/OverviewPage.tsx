
import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminDashboard } from "@/admin/components/dashboard/AdminDashboard";

export default function OverviewPage() {
  console.log("Rendering OverviewPage");
  
  useEffect(() => {
    console.log("OverviewPage mounted");
  }, []);
  
  return (
    <AdminLayout title="Admin Dashboard">
      <AdminDashboard />
    </AdminLayout>
  );
}
