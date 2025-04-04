
import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminDashboard } from "@/admin/components/dashboard/AdminDashboard";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";

export default function OverviewPage() {
  const logger = useLogger("OverviewPage", { category: LogCategory.ADMIN });
  
  useEffect(() => {
    logger.info("OverviewPage mounted");
  }, [logger]);
  
  return (
    <AdminLayout title="Admin Dashboard">
      <AdminDashboard />
    </AdminLayout>
  );
}
