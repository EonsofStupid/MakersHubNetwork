
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePartsCount } from '@/admin/queries/usePartsCount';
import { useTotalUsersCount } from '@/admin/queries/useTotalUsersCount';
import { useReviewsCount } from '@/admin/queries/useReviewsCount';

interface StatsCardsProps {
  minimal?: boolean;
}

export const StatsCards = ({ minimal = false }: StatsCardsProps) => {
  const { data: partsCount, isLoading: isLoadingParts } = usePartsCount();
  const { data: usersCount, isLoading: isLoadingUsers } = useTotalUsersCount();
  const { data: reviewsCount, isLoading: isLoadingReviews } = useReviewsCount();

  if (minimal) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between p-2 border-b">
          <span className="text-sm font-medium">Total Parts</span>
          <span className="text-sm">{isLoadingParts ? "Loading..." : partsCount}</span>
        </div>
        <div className="flex justify-between p-2 border-b">
          <span className="text-sm font-medium">Users</span>
          <span className="text-sm">{isLoadingUsers ? "Loading..." : usersCount}</span>
        </div>
        <div className="flex justify-between p-2 border-b">
          <span className="text-sm font-medium">Reviews</span>
          <span className="text-sm">{isLoadingReviews ? "Loading..." : reviewsCount}</span>
        </div>
      </div>
    );
  }

  return (
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
  );
};
