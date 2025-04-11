
import React, { useEffect } from "react";
import { useReviewAdminStore } from "@/admin/store/reviewAdmin.store";
import { ReviewCard } from "./ReviewCard";
import { ReviewStatsDisplay } from "./ReviewStats";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from '@/ui/core/alert';
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  buildId: string;
  showStats?: boolean;
  isAdmin?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function ReviewList({
  buildId,
  showStats = true,
  isAdmin = false,
  showFilters = true,
  className
}: ReviewListProps) {
  const {
    reviews,
    stats,
    filters,
    isLoading,
    error,
    fetchReviews,
    fetchReviewStats,
    updateFilters,
    approveReview,
    rejectReview
  } = useReviewAdminStore();
  
  // Load reviews and stats
  useEffect(() => {
    fetchReviews(buildId);
    if (showStats) {
      fetchReviewStats(buildId);
    }
  }, [buildId, fetchReviews, fetchReviewStats, showStats, filters]);
  
  // Handle approving a review
  const handleApprove = async (reviewId: string) => {
    await approveReview(reviewId);
    fetchReviews(buildId);
    if (showStats) {
      fetchReviewStats(buildId);
    }
  };
  
  // Handle rejecting a review
  const handleReject = async (reviewId: string) => {
    await rejectReview(reviewId);
  };
  
  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
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
  
  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header with stats and filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stats */}
          {showStats && stats && (
            <div className="md:col-span-1">
              <ReviewStatsDisplay stats={stats} />
            </div>
          )}
          
          {/* Filters */}
          {showFilters && (
            <div className={cn(
              "flex items-end gap-4", 
              showStats ? "md:col-span-2" : "md:col-span-3"
            )}>
              <div className="w-full md:w-[200px]">
                <label className="text-sm font-medium mb-1.5 block">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => 
                    updateFilters({ sortBy: value as typeof filters.sortBy })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort reviews" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="highest_rated">Highest Rated</SelectItem>
                    <SelectItem value="most_helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isAdmin && (
                <div className="w-full md:w-[200px]">
                  <label className="text-sm font-medium mb-1.5 block">Show</label>
                  <Select
                    value={filters.approvedOnly ? "approved" : "all"}
                    onValueChange={(value) => 
                      updateFilters({ approvedOnly: value === "approved" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter reviews" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reviews</SelectItem>
                      <SelectItem value="approved">Approved Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Reviews list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                isAdmin={isAdmin}
                isPending={!review.approved}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
