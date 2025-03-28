
import React from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import BuildDetail from "../BuildDetail";

export default function BuildDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AdminLayout title="Build Details" requiredPermission="builds:view">
      <BuildDetail id={id} />
    </AdminLayout>
  );
}
