
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewImageUploadProps {
  imageUrls: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real application, you would upload this file to your server or CDN
    // For this mock component, we'll create a fake URL
    const fakeUrl = URL.createObjectURL(files[0]);
    onAddImage(fakeUrl);
    
    // Reset the file input
    e.target.value = '';
  };
  
  return (
    <div className={cn("space-y-3", className)}>
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {imageUrls.map((url, index) => (
            <Card key={index} className="overflow-hidden relative aspect-square">
              <img 
                src={url} 
                alt={`Review image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {!disabled && (
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Add images to your review</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={disabled}
            />
          </div>
        </label>
      )}
    </div>
  );
}
