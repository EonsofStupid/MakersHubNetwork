
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingStars } from './RatingStars';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Flag, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewCategory, BuildReview } from '@/admin/types/review.types';
import { ReviewImageUpload } from './ReviewImageUpload';

interface ReviewCardProps {
  id?: string;
  title?: string;
  content?: string;
  rating?: number;
  categories?: ReviewCategory[];
  userName?: string;
  userAvatar?: string;
  buildName?: string;
  date?: string;
  likes?: number;
  dislikes?: number;
  images?: string[];
  isVerified?: boolean;
  isAdmin?: boolean;
  isEditable?: boolean;
  isPending?: boolean;
  review?: BuildReview;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function ReviewCard({
  id,
  title,
  content,
  rating,
  categories,
  userName,
  userAvatar,
  buildName,
  date,
  likes,
  dislikes,
  images = [],
  isVerified = false,
  isAdmin = false,
  isEditable = false,
  isPending = false,
  review,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  className
}: ReviewCardProps) {
  // If review object is provided, use its properties instead of individual props
  const reviewId = review?.id || id || '';
  const reviewTitle = review?.title || title || '';
  const reviewContent = review?.body || content || '';
  const reviewRating = review?.rating || rating || 0;
  const reviewCategories = review?.category || categories || [];
  const reviewUserName = review?.reviewer_name || userName || 'Anonymous';
  const reviewDate = review?.created_at ? new Date(review.created_at).toLocaleDateString() : date || '';
  const reviewImages = review?.image_urls || images || [];
  const reviewIsVerified = review?.approved || isVerified;
  const isPendingReview = isPending || (review && !review.approved);
  
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>(reviewImages);
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit(reviewId);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(reviewId);
  };
  
  const handleApprove = () => {
    if (onApprove) onApprove(reviewId);
  };
  
  const handleReject = () => {
    if (onReject) onReject(reviewId);
  };
  
  // Adding async to make it return a Promise<void>
  const handleAddImage = async (file: File): Promise<void> => {
    // In a real implementation, this would upload the image to a server
    // For now, we'll just create a local URL
    const url = URL.createObjectURL(file);
    setLocalImages(prev => [...prev, url]);
    
    // Return a resolved promise to satisfy the type
    return Promise.resolve();
  };
  
  const handleRemoveImage = (index: number) => {
    setLocalImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const truncatedContent = reviewContent.length > 200 && !isExpanded
    ? reviewContent.substring(0, 200) + '...'
    : reviewContent;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{reviewTitle}</h3>
              {reviewIsVerified && !isPendingReview && (
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                  Verified
                </Badge>
              )}
              {isPendingReview && (
                <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                  Pending
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{reviewUserName}</span>
              {buildName && (
                <>
                  <span>•</span>
                  <span>{buildName}</span>
                </>
              )}
              <span>•</span>
              <span>{reviewDate}</span>
            </div>
          </div>
          <RatingStars rating={reviewRating} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {localImages.length > 0 && (
          <div className="mb-4">
            <ReviewImageUpload 
              imageUrls={localImages}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              disabled={!isEditable}
              className="mt-2"
            />
          </div>
        )}
        
        <p className="text-sm">
          {truncatedContent}
          {reviewContent.length > 200 && (
            <Button
              variant="link"
              className="px-0 h-auto font-normal"
              onClick={toggleExpand}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </p>
        
        {reviewCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {reviewCategories.map(category => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {likes || 0}
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <ThumbsDown className="h-4 w-4 mr-1" />
            {dislikes || 0}
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
        
        {(isAdmin || isEditable) && (
          <div className="flex items-center gap-1">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
            
            {isEditable && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
