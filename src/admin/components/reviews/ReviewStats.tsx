
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/core/card';
import { ReviewStats } from "@/admin/types/review.types";
import { Progress } from '@/ui/core/progress';
import { cn } from "@/lib/utils";

interface ReviewStatsDisplayProps {
  stats: ReviewStats;
  className?: string;
}

export function ReviewStatsDisplay({ stats, className }: ReviewStatsDisplayProps) {
  // Calculate the percentage for each star rating
  const calculatePercentage = (rating: number) => {
    if (stats.totalReviews === 0) return 0;
    return (stats.ratingDistribution[rating] / stats.totalReviews) * 100;
  };
  
  return (
    <Card className={cn("border-primary/20", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Reviews Summary</span>
          <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-1">{stats.totalReviews} total reviews</div>
        
        <div className="space-y-2 mt-3">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center w-8">
                <span className="text-sm font-medium">{rating}</span>
                <span className="text-amber-500 ml-1">★</span>
              </div>
              <Progress value={calculatePercentage(rating)} className="h-2" />
              <span className="text-xs text-muted-foreground w-9">
                {stats.ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
        
        {stats.totalReviews > 0 && (
          <div className="mt-4 border-t pt-4 border-border/60">
            <h4 className="text-sm font-medium mb-2">Top Categories</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([category, count]) => (
                  <div 
                    key={category} 
                    className="text-xs px-2 py-1 bg-primary/10 rounded-full"
                  >
                    {category} ({count})
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
