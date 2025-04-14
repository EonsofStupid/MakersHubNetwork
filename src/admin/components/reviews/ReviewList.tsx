
import React from 'react';
import { ReviewCard } from './ReviewCard';

export interface ReviewListProps {
  className?: string;
}

export function ReviewList({ className = '' }: ReviewListProps) {
  const reviews: any[] = [];

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Reviews</h3>
      
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews available</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id} // key is used as a React prop, not passed to component
              title={review.title}
              content={review.content}
              rating={review.rating}
              author={review.author}
              date={review.date}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewList;
