
import React from 'react';

export interface ReviewsOverviewProps {
  className?: string;
}

export function ReviewsOverview({ className = '' }: ReviewsOverviewProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-2">Reviews Overview</h3>
      <p className="text-sm text-muted-foreground">No reviews available</p>
    </div>
  );
}

export default ReviewsOverview;
