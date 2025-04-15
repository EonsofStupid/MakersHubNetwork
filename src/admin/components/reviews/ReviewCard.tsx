
import React from 'react';

export interface ReviewCardProps {
  title?: string;
  content?: string;
  rating?: number;
  author?: string;
  date?: string;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  title = 'Untitled Review',
  content = 'No content',
  rating = 0,
  author = 'Anonymous',
  date = new Date().toLocaleDateString(),
  className = ''
}) => {
  return (
    <div className={`border border-border rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>★</span>
          ))}
        </div>
      </div>
      <p className="text-sm mb-3">{content}</p>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{author}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
