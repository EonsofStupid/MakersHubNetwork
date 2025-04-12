
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Star } from 'lucide-react';
import { Progress } from '@/shared/ui/progress';
import { ReviewStats } from '@/shared/types/shared.types';

interface ReviewStatsDisplayProps {
  stats: ReviewStats;
}

export function ReviewStatsDisplay({ stats }: ReviewStatsDisplayProps) {
  if (!stats) {
    return null;
  }
  
  const {
    totalReviews,
    avgRating,
    ratingCounts
  } = stats;
  
  // Calculate the percentage for each rating level
  const getRatingPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1 text-lg">
          Rating Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center text-3xl font-bold mb-1">
            {avgRating.toFixed(1)}
            <Star className="h-5 w-5 ml-1 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
        </div>
        
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-10">
                <span>{rating}</span>
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              </div>
              <Progress 
                value={getRatingPercentage(ratingCounts[rating as keyof typeof ratingCounts] || 0)} 
                className="h-2"
              />
              <div className="text-xs w-8 text-right">
                {ratingCounts[rating as keyof typeof ratingCounts] || 0}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
