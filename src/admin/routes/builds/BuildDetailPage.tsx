
import React from "react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { BuildDetailView } from "@/admin/components/builds/BuildDetailView";

export default function BuildDetailPage() {
  return (
    <ImpulseAdminLayout title="Build Review">
      <BuildDetailView />
    </ImpulseAdminLayout>
  );
}
