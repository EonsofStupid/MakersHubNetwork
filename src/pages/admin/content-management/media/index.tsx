import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MediaLibrary = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data, error } = await supabase.from("media").select("*");
    if (error) {
      toast.error("Error fetching media");
    } else {
      setUploadedMedia(data || []);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    toast.loading("Uploading files...");

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadMedia(file);
          await supabase.from("media").insert({ name: file.name, url, type: file.type });
          return url;
        })
      );

      setFiles([]);
      await fetchMedia();
      toast.success("Files uploaded successfully");
    } catch (err) {
      toast.error("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 p-8">
      <AdminNav />
      <div className="container mx-auto">
        <Card className="bg-gray-800/50 border-white/10 p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Media Library</h1>
          
          <div className="mb-8">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="mr-4">
                <Upload className="w-4 h-4 mr-2" />
                Select Files
              </Button>
            </label>
            <Button onClick={handleUpload} disabled={loading || files.length === 0}>
              {loading ? "Uploading..." : "Upload Selected"}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uploadedMedia.map((media) => (
              <Card key={media.id} className="bg-gray-700/50 border-white/10 p-4">
                <img 
                  src={media.url} 
                  alt={media.name} 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-white/80 text-sm truncate">{media.name}</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from('media')
                        .delete()
                        .eq('id', media.id);
                      
                      if (error) throw error;
                      
                      toast.success('Media deleted successfully');
                      fetchMedia();
                    } catch (err) {
                      toast.error('Error deleting media');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MediaLibrary;