
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useReviewImages } from "@/admin/hooks/useReviewImages";
import { cn } from "@/lib/utils";

interface ReviewImageUploadProps {
  imageUrls: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ReviewImageUpload({
  imageUrls,
  onAddImage,
  onRemoveImage,
  disabled = false,
  className
}: ReviewImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage, isUploading: hookUploading, error } = useReviewImages();
  
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || disabled) return;
    
    setIsUploading(true);
    
    try {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = await uploadImage(file);
        if (url) {
          onAddImage(url);
        }
      }
    } finally {
      setIsUploading(false);
      // Clear input value to allow uploading the same file again
      e.target.value = '';
    }
  };
  
  return (
    <div className={cn("space-y-3", className)}>
      {/* Display existing images in a grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden aspect-square">
              <img 
                src={url} 
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(url)}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload button */}
      {!disabled && (
        <div>
          <input
            type="file"
            id="review-image-upload"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={handleImageSelect}
            disabled={isUploading || hookUploading || disabled}
          />
          <label
            htmlFor="review-image-upload"
            className={cn(
              "flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              (isUploading || hookUploading) && "opacity-50 cursor-not-allowed",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            {isUploading || hookUploading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Drag & drop or click to upload images
                </span>
              </div>
            )}
          </label>
          
          {error && (
            <p className="text-xs text-destructive mt-1">{error}</p>
          )}
        </div>
      )}
      
      {/* Display placeholder if no images and in read-only mode */}
      {disabled && imageUrls.length === 0 && (
        <div className="flex items-center justify-center border border-dashed border-muted-foreground/20 rounded-md p-8">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
            <span>No images attached</span>
          </div>
        </div>
      )}
    </div>
  );
}
