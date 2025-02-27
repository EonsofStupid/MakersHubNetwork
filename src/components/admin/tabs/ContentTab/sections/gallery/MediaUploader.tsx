
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface MediaUploaderProps {
  onUpload: (files: FileList) => void;
}

export const MediaUploader = ({ onUpload }: MediaUploaderProps) => {
  return (
    <Card className="p-8 border-2 border-dashed border-primary/20 text-center">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        multiple
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto text-primary/60" />
        <p className="mt-2 text-muted-foreground">
          Drag and drop files here or click to browse
        </p>
      </label>
    </Card>
  );
};
