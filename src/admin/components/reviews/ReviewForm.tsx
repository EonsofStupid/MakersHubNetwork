
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { RatingStars, ReviewRating } from './RatingStars';
import { CategorySelector } from './CategorySelector';
import { ReviewImageUpload } from './ReviewImageUpload';
import { ReviewCategory } from '@/admin/types/review.types';
import { useReviewImages } from '@/admin/hooks/useReviewImages';

interface ReviewFormProps {
  buildId?: string;
  onSubmit?: (review: any) => void;
  onSuccess?: () => void;
  initialData?: any;
  isLoading?: boolean;
}

export function ReviewForm({ buildId, onSubmit, onSuccess, initialData, isLoading = false }: ReviewFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState<ReviewRating>(initialData?.rating || 0);
  const [categories, setCategories] = useState<ReviewCategory[]>(initialData?.categories || []);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  const { uploadImage, isUploading } = useReviewImages();
  
  const handleRatingChange = (newRating: ReviewRating) => {
    setRating(newRating);
  };
  
  const handleCategoryChange = (selectedCategories: ReviewCategory[]) => {
    setCategories(selectedCategories);
  };
  
  const handleAddImage = async (file: File) => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setImages(prev => [...prev, imageUrl]);
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit({
        buildId,
        title,
        content,
        rating,
        categories,
        images
      });
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <FormLabel htmlFor="title">Review Title</FormLabel>
        <Input 
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a title for your review"
          required
        />
      </div>
      
      <div className="space-y-2">
        <FormLabel htmlFor="rating">Rating</FormLabel>
        <RatingStars 
          rating={rating} 
          onChange={handleRatingChange}
          readOnly={false}
          interactive={true}
          size="lg"
        />
      </div>
      
      <div className="space-y-2">
        <FormLabel htmlFor="category">Categories</FormLabel>
        <CategorySelector 
          selectedCategories={categories}
          onChange={handleCategoryChange}
        />
      </div>
      
      <div className="space-y-2">
        <FormLabel htmlFor="content">Review Content</FormLabel>
        <Textarea 
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your review here..."
          rows={6}
          required
        />
      </div>
      
      <div className="space-y-2">
        <FormLabel>Images</FormLabel>
        <ReviewImageUpload 
          imageUrls={images}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          disabled={isLoading || isUploading}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading || isUploading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
