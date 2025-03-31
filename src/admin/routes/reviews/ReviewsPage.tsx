
import React from "react";
import { MessageSquare } from "lucide-react";
import { ImpulseAdminLayout } from "@/admin/components/layout/ImpulseAdminLayout";
import { PendingReviewsList } from "@/admin/components/reviews/PendingReviewsList";

export default function ReviewsPage() {
  return (
    <ImpulseAdminLayout title="Review Management">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary w-5 h-5" />
          <h1 className="text-2xl font-bold">Build Reviews</h1>
        </div>
        
        <PendingReviewsList />
      </div>
    </ImpulseAdminLayout>
  );
}
