
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewImageUploadProps {
  imageUrls: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (url: string) => void;
  disabled?: boolean;
  maxImages?: number;
  className?: string;
}

export function ReviewImageUpload({
  imageUrls,
  onAddImage,
  onRemoveImage,
  disabled = false,
  maxImages = 3,
  className
}: ReviewImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (imageUrls.length + files.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} images`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `review_images/${fileName}`;
        
        // Upload the file
        const { error: uploadError, data } = await supabase.storage
          .from('review_images')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('review_images')
          .getPublicUrl(filePath);
        
        // Add the URL to the list
        onAddImage(publicUrl);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading || imageUrls.length >= maxImages}
      />
      
      {/* Image preview grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, index) => (
            <div 
              key={index} 
              className="relative aspect-square rounded-md overflow-hidden group"
            >
              <img 
                src={url} 
                alt={`Review image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => onRemoveImage(url)}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload button */}
      {!disabled && imageUrls.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={triggerFileInput}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Images ({imageUrls.length}/{maxImages})
            </>
          )}
        </Button>
      )}
      
      {/* No images placeholder */}
      {imageUrls.length === 0 && disabled && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
          <ImageIcon className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-muted-foreground text-sm">No images attached</span>
        </div>
      )}
    </div>
  );
}
