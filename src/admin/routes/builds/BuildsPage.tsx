
import React from "react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { BuildsOverview } from "@/admin/components/builds/BuildsOverview";

export default function BuildsPage() {
  return (
    <ImpulseAdminLayout title="Builds Management" requiresPermission="builds:view">
      <BuildsOverview />
    </ImpulseAdminLayout>
  );
}
