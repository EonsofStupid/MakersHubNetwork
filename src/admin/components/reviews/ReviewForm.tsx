
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { RatingStars, ReviewRating } from './RatingStars';
import { CategorySelector } from './CategorySelector';
import { ReviewImageUpload } from './ReviewImageUpload';

interface ReviewFormProps {
  onSubmit: (review: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function ReviewForm({ onSubmit, initialData, isLoading = false }: ReviewFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState<ReviewRating>(initialData?.rating || 0);
  const [category, setCategory] = useState(initialData?.category || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  
  const handleRatingChange = (newRating: ReviewRating) => {
    setRating(newRating);
  };
  
  const handleImageUpload = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      content,
      rating,
      category,
      images
    });
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
        <FormLabel htmlFor="category">Category</FormLabel>
        <CategorySelector 
          selectedCategory={category}
          onCategoryChange={setCategory}
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
          onImageUploaded={handleImageUpload}
        />
        
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((image, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={image} 
                  alt={`Review image ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full 
                            opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
