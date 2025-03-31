
import React from "react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { ReviewsOverview } from "@/admin/components/reviews/ReviewsOverview";

export default function ReviewsPage() {
  return (
    <ImpulseAdminLayout title="Reviews Management">
      <ReviewsOverview />
    </ImpulseAdminLayout>
  );
}
