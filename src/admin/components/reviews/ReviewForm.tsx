
import React, { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useReviewDraftStore } from "@/admin/store/reviewDraft.store";
import { RatingStars, ReviewRating } from "./RatingStars";
import { CategorySelector } from "./CategorySelector";
import { ReviewImageUpload } from "./ReviewImageUpload";
import { ReviewCategory } from "@/admin/types/review.types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewFormProps {
  buildId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ReviewForm({ buildId, onSuccess, className }: ReviewFormProps) {
  const { 
    draft,
    isSubmitting,
    error,
    setRating,
    setTitle,
    setBody,
    addCategory,
    removeCategory,
    addImageUrl,
    removeImageUrl,
    submitReview,
    resetDraft,
    setDraft
  } = useReviewDraftStore();

  // Set build ID when the component mounts
  useEffect(() => {
    setDraft({ buildId });
    return () => resetDraft();
  }, [buildId, setDraft, resetDraft]);

  const handleCategoryChange = (categories: ReviewCategory[]) => {
    // Clear existing categories and add the new ones
    setDraft({ categories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitReview();
    if (success && onSuccess) {
      onSuccess();
    }
  };

  // Handle image upload and removal with proper typing
  const handleAddImage = (url: string) => {
    addImageUrl(url);
  };

  const handleRemoveImage = (index: number) => {
    removeImageUrl(index);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <RatingStars 
              rating={draft.rating || 0} 
              readOnly={false}
              interactive={true}
              size="lg" 
              onChange={(rating: ReviewRating) => setRating(rating)} 
              className="py-2" 
            />
          </div>
          
          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={draft.title || ''}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="body">Review</Label>
            <Textarea
              id="body"
              value={draft.body || ''}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your experience with this build"
              rows={5}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <CategorySelector
              selectedCategories={draft.categories || []}
              onChange={handleCategoryChange}
              readOnly={isSubmitting}
            />
          </div>
          
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Images (Optional)</Label>
            <ReviewImageUpload
              imageUrls={draft.imageUrls || []}
              onAddImage={handleAddImage}
              onRemoveImage={handleRemoveImage}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Review...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
