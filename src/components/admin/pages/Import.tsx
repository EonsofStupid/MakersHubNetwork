
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useAdminStore } from "@/stores/admin/store";

const Import = () => {
  const { toast } = useToast();
  const { hasPermission } = useAdminStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Simulate file upload
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus('success');
          toast({
            title: "Upload Complete",
            description: "Your file was successfully uploaded and is ready for import."
          });
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  if (!hasPermission("admin:data:import")) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to import data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Upload className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading cyber-text-glow">Data Import</h2>
      </div>
      
      <Card className="cyber-card border-primary/20">
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>
            Upload CSV or JSON files to import data into the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:bg-primary/5 transition-colors">
              <div className="flex flex-col items-center justify-center gap-2">
                <FileText className="h-10 w-10 text-primary/60" />
                <h3 className="text-lg font-medium">Drag and drop your files here</h3>
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, JSON, XML (Max size: 10MB)
                </p>
                <div className="mt-4">
                  <Button className="relative overflow-hidden">
                    <input
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileChange}
                      accept=".csv,.json,.xml"
                    />
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
            
            {uploadStatus !== 'idle' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {uploadStatus === 'uploading' && 'Uploading...'}
                    {uploadStatus === 'success' && 'Upload complete'}
                    {uploadStatus === 'error' && 'Upload failed'}
                  </span>
                  {uploadStatus === 'uploading' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {uploadStatus === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadStatus === 'error' && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
