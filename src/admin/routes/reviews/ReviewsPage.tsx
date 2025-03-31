
import React from "react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { PendingReviewsList } from "@/admin/components/reviews/PendingReviewsList";

export default function ReviewsPage() {
  return (
    <ImpulseAdminLayout title="Reviews Management">
      <PendingReviewsList />
    </ImpulseAdminLayout>
  );
}
