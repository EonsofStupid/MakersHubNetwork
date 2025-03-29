
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewRating } from "@/admin/types/review.types";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: ReviewRating) => void;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  className
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };
  
  const handleClick = (newRating: number) => {
    if (interactive && onChange) {
      onChange(newRating as ReviewRating);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-0.5", 
        interactive && "cursor-pointer",
        className
      )}
      onMouseLeave={() => interactive && setHoverRating(0)}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = interactive 
          ? (hoverRating > 0 ? starValue <= hoverRating : starValue <= rating)
          : starValue <= rating;
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
              interactive && "transition-all duration-100 hover:scale-110"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
          />
        );
      })}
    </div>
  );
}
