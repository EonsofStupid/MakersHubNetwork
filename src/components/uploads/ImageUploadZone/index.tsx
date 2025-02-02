import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  validateImageFile, 
  validateMaxCount, 
  validateDuplicateFile,
  ACCEPTED_IMAGE_FORMATS 
} from "@/utils/validation";
import { ImageUploadZoneProps } from "./types";

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({ images, onImagesChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!validateImageFile(file)) {
        return false;
      }
      if (!validateMaxCount(images.length)) {
        toast.error("Maximum number of images reached");
        return false;
      }
      if (!validateDuplicateFile(file, images)) {
        toast.error(`Sorry, ${file.name} already exists in this directory`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles].slice(0, 7));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    validateAndProcessFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      validateAndProcessFiles(files);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null && confirmDelete) {
      onImagesChange(images.filter((_, i) => i !== deleteIndex));
    }
    setDeleteIndex(null);
    setConfirmDelete(false);
  };

  return (
    <div className="flex gap-6 animate-fade-in">
      <div className="flex flex-col items-center space-y-4 w-[22%]">
        <Button
          asChild
          className="w-full py-2 bg-black/30 border border-white/10 text-white rounded-lg backdrop-blur-md hover:shadow-[0_0_12px_rgba(255,0,171,0.8)] transition-all hover:text-[#ff0abe]"
        >
          <label htmlFor="image-upload">
            Upload Image
            <input
              id="image-upload"
              type="file"
              multiple
              accept={ACCEPTED_IMAGE_FORMATS.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </Button>

        <div
          className={`w-full h-[22.5vh] border-2 border-dashed ${
            dragActive ? 'border-[#ff0abe]' : 'border-[#41f0db]'
          } bg-black/30 rounded-lg flex items-center justify-center text-[#41f0db] text-sm relative transition-all ${
            dragActive ? 'scale-105' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <X 
              size={40} 
              className={`mb-2 ${dragActive ? 'animate-pulse text-[#ff0abe]' : ''}`}
            />
            Drop Images Here
            {images.length >= 7 && (
              <p className="text-[#ff0abe] mt-2">Maximum images (7) reached</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 flex-1">
        {images.map((file, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={`Upload ${index + 1}`}
              className="w-full h-[75px] object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.02] border-2 border-transparent hover:border-[#8000ff] hover:shadow-[0_0_15px_rgba(128,0,255,0.5)] transition-all"
            />
            <button
              onClick={() => setDeleteIndex(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <X size={16} className="text-white hover:text-[#ff0abe]" />
            </button>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <AlertDialogContent className="bg-black/80 backdrop-blur-xl border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ff0abe]">Delete Image</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Are you sure you want to delete this image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <Checkbox
              id="confirm-delete"
              checked={confirmDelete}
              onCheckedChange={(checked) => setConfirmDelete(checked as boolean)}
            />
            <label htmlFor="confirm-delete" className="text-white/80">
              Yes, I want to delete this image
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={!confirmDelete}
              className="bg-red-500/20 text-white border border-red-500/50 hover:bg-red-500/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageUploadZone;