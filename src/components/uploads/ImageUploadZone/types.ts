export interface ImageUploadZoneProps {
  images: File[];
  onImagesChange: (newImages: File[]) => void;
}