
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BuildReview } from "@/admin/types/review.types";
import { RatingStars } from "./RatingStars";
import { formatDistance } from "date-fns";
import { CategorySelector } from "./CategorySelector";
import { ReviewImageUpload } from "./ReviewImageUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ThumbsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: BuildReview;
  isAdmin?: boolean;
  isPending?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  className?: string;
}

export function ReviewCard({
  review,
  isAdmin = false,
  isPending = false,
  onApprove,
  onReject,
  className
}: ReviewCardProps) {
  // Get first letter of reviewer name or use fallback
  const getInitial = () => {
    if (review.reviewer_name) {
      return review.reviewer_name.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={``} alt={review.reviewer_name || "User"} />
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{review.reviewer_name || "Anonymous"}</div>
            <div className="flex items-center space-x-2">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatDistance(new Date(review.created_at), new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
        
        {isPending && isAdmin && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onApprove && onApprove(review.id)}
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onReject && onReject(review.id)}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Review title and body */}
        <div>
          <h3 className="font-semibold mb-1">{review.title}</h3>
          <p className="text-sm">{review.body}</p>
        </div>
        
        {/* Categories */}
        {review.category && review.category.length > 0 && (
          <CategorySelector 
            selectedCategories={review.category} 
            onChange={() => {}} 
            readOnly={true} 
          />
        )}
        
        {/* Images */}
        {review.image_urls && review.image_urls.length > 0 && (
          <ReviewImageUpload 
            imageUrls={review.image_urls} 
            onAddImage={() => {}} 
            onRemoveImage={() => {}} 
            disabled={true}
          />
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Pending badge */}
          {isPending && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Pending Approval
            </Badge>
          )}
          
          {/* This would be helpful votes feature in the future */}
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
