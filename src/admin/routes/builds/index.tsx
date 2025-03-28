
import React from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import BuildsApproval from "./BuildsApproval";

export default function BuildsAdmin() {
  return (
    <AdminLayout title="Build Approvals" requiredPermission="builds:view">
      <BuildsApproval />
    </AdminLayout>
  );
}
