
import React from "react";
import { AdminLayout } from "@/admin/components/layouts/AdminLayout";
import UsersManagement from "@/admin/features/users/UsersManagement";

export default function UsersPage() {
  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  );
}
