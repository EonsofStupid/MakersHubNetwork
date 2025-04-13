
import React, { useEffect } from "react";
import { useReviewAdminStore } from "@/admin/store/reviewAdmin.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCard } from "./ReviewCard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { PackageCheck } from "lucide-react";

export function PendingReviewsList() {
  const navigate = useNavigate();
  const {
    pendingReviews,
    isLoading,
    error,
    fetchPendingReviews,
    approveReview,
    rejectReview
  } = useReviewAdminStore();
  
  // Load pending reviews
  useEffect(() => {
    fetchPendingReviews();
  }, [fetchPendingReviews]);
  
  // Handle approving a review
  const handleApprove = async (reviewId: string) => {
    await approveReview(reviewId);
  };
  
  // Handle rejecting a review
  const handleReject = async (reviewId: string) => {
    await rejectReview(reviewId);
  };
  
  // Navigate to the build detail view
  const handleViewBuild = (buildId: string) => {
    navigate(`/admin/builds/${buildId}`);
  };
  
  if (isLoading && pendingReviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (pendingReviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <PackageCheck className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-medium">No pending reviews</h3>
            <p className="text-muted-foreground">All reviews have been processed</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Pending Reviews</span>
          <span className="bg-primary/20 text-primary text-xs py-0.5 px-2 rounded-full">
            {pendingReviews.length}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {pendingReviews.map(review => (
            <div key={review.id} className="space-y-2">
              <ReviewCard
                review={review}
                isAdmin={true}
                isPending={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleViewBuild(review.build_id)}
                >
                  View Build
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
