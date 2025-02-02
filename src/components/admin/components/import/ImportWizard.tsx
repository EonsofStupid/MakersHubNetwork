import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileType, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { validateImportedAsset, importConfigs } from './validation';
import type { ImportWizardProps } from './types';

const ImportWizard: React.FC<ImportWizardProps> = ({ 
  type = 'csv',
  acceptedTypes = ['.csv'],
  onImport 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExt = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
      if (acceptedTypes.includes(fileExt)) {
        setFile(selectedFile);
      } else {
        toast.error(`Please select a valid file (${acceptedTypes.join(', ')})`);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      if (type !== 'csv') {
        const content = await file.text();
        const data = JSON.parse(content);
        const config = importConfigs[type];
        
        if (config) {
          const validation = validateImportedAsset(data, config);
          if (!validation.isValid) {
            throw new Error(validation.errors?.[0] || 'Invalid import data');
          }
        }
      }

      onImport([file]);
      toast.success("Import started successfully");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.message || "Failed to start import");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Import {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          {file && (
            <div className="flex items-center text-sm text-green-500">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              File selected
            </div>
          )}
        </div>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to select a file ({acceptedTypes.join(', ')})
            </span>
          </label>
        </div>

        {file && (
          <div className="flex justify-end">
            <Button
              onClick={handleImport}
              disabled={importing}
              className="w-full sm:w-auto"
            >
              {importing ? "Importing..." : "Start Import"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export { ImportWizard };
export default ImportWizard;