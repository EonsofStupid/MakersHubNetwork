
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReviewStats } from "@/admin/types/review.types";
import { RatingStars } from "./RatingStars";
import { cn } from "@/lib/utils";

interface ReviewStatsDisplayProps {
  stats: ReviewStats;
  className?: string;
}

export function ReviewStatsDisplay({ stats, className }: ReviewStatsDisplayProps) {
  const { averageRating, totalReviews, ratingDistribution, categoryBreakdown } = stats;
  
  // Calculate percentages for rating distribution
  const ratingPercentages = Object.entries(ratingDistribution).map(([rating, count]) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating: Number(rating), count, percentage };
  }).sort((a, b) => b.rating - a.rating); // Sort by rating (5 to 1)
  
  // Sort categories by count (most common first)
  const sortedCategories = Object.entries(categoryBreakdown)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Review Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall rating */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold mb-1">
              {averageRating ? averageRating.toFixed(1) : "0.0"}
            </div>
            <RatingStars rating={averageRating} />
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-sm">Based on</div>
            <div className="font-medium">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</div>
          </div>
        </div>
        
        {/* Rating distribution */}
        <div className="space-y-2">
          {ratingPercentages.map(({ rating, count, percentage }) => (
            <div key={rating} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-sm font-medium text-right">{rating}</div>
              <div className="col-span-9">
                <Progress value={percentage} className="h-2" />
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {count}
              </div>
            </div>
          ))}
        </div>
        
        {/* Category breakdown */}
        {sortedCategories.length > 0 && (
          <div className="space-y-1 pt-2">
            <div className="text-sm font-semibold mb-1">Most Mentioned</div>
            <div className="flex flex-wrap gap-1">
              {sortedCategories.slice(0, 3).map(({ category, count }) => (
                <div 
                  key={category} 
                  className="px-2 py-1 bg-muted rounded-full text-xs flex items-center gap-1"
                >
                  <span>{category}</span>
                  <span className="text-muted-foreground">({count})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
