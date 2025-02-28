
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePartsCount } from "@/admin/queries/usePartsCount";
import { useTotalUsersCount } from "@/admin/queries/useTotalUsersCount";
import { useReviewsCount } from "@/admin/queries/useReviewsCount";
import { useTrendingParts } from "@/admin/queries/useTrendingParts";

export const OverviewTab = () => {
  const { data: partsCount, isLoading: isLoadingParts } = usePartsCount();
  const { data: usersCount, isLoading: isLoadingUsers } = useTotalUsersCount();
  const { data: reviewsCount, isLoading: isLoadingReviews } = useReviewsCount();
  const { data: trendingParts, isLoading: isLoadingTrending } = useTrendingParts();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading cyber-text-glow">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cyber-card border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Total Parts</CardTitle>
            <CardDescription>Number of parts in database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoadingParts ? "Loading..." : partsCount}</p>
          </CardContent>
        </Card>
        
        <Card className="cyber-card border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoadingUsers ? "Loading..." : usersCount}</p>
          </CardContent>
        </Card>
        
        <Card className="cyber-card border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle>Reviews</CardTitle>
            <CardDescription>Total submitted reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isLoadingReviews ? "Loading..." : reviewsCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>Trending Parts</CardTitle>
          <CardDescription>Most viewed in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTrending ? (
            <p>Loading trending parts...</p>
          ) : (
            <div className="space-y-2">
              {trendingParts && trendingParts.length > 0 ? (
                trendingParts.map((part, index) => (
                  <div key={part.id} className="flex items-center justify-between p-2 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary/70">#{index + 1}</span>
                      <span>{part.name}</span>
                    </div>
                    <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                      {part.view_count} views
                    </span>
                  </div>
                ))
              ) : (
                <p>No trending parts found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
