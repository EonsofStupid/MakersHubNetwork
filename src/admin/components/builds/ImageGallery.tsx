
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!images || images.length === 0) {
    return (
      <div className="rounded-md bg-muted/50 h-64 flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }
  
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-md bg-muted/10 aspect-video">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              <img
                src={images[activeIndex]}
                alt="Build"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity flex items-center justify-center">
                <ZoomIn className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-auto p-2">
            <div className="relative w-full h-full">
              <img
                src={images[activeIndex]}
                alt="Build"
                className="w-full h-full object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="text-white w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="text-white w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="text-white w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="text-white w-4 h-4" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 overflow-auto py-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden transition-all border-2",
                activeIndex === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
