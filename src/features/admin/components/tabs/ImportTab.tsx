
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { ImportStep, ImportPreviewData } from '../../types/import';
import { Upload, FileUp, Table, Check } from 'lucide-react';
import { ColumnMappingStep } from './import/ColumnMappingStep';
import { PreviewStep } from './import/PreviewStep';
import { ImportProgress } from './import/ImportProgress';

type ImportableTables = 'printer_parts' | 'manufacturers' | 'printer_part_categories';

export const ImportTab = () => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [selectedTable, setSelectedTable] = useState<ImportableTables>('printer_parts');
  const [csvData, setCSVData] = useState<string[][]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [previewData, setPreviewData] = useState<ImportPreviewData[]>([]);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      setCSVData(rows);
      setCurrentStep('mapping');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to parse CSV file',
        variant: 'destructive',
      });
    }
  };

  const validateMappedData = (data: ImportPreviewData): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Validate required fields based on selected table
    if (!data.mapped.name || !data.mapped.slug) {
      errors.push({
        row: 0,
        column: 'name/slug',
        message: 'Name and slug are required fields'
      });
    }

    return errors;
  };

  const handleColumnMappingComplete = (mappings: Record<string, string>) => {
    setColumnMappings(mappings);
    // Generate preview data based on mappings
    const preview = csvData.slice(1).map(row => {
      const mapped: Record<string, any> = {};
      Object.entries(mappings).forEach(([csvCol, targetField]) => {
        const colIndex = csvData[0].indexOf(csvCol);
        if (colIndex !== -1) {
          mapped[targetField] = row[colIndex];
        }
      });

      // Generate slug if not provided
      if (!mapped.slug && mapped.name) {
        mapped.slug = mapped.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      const previewData: ImportPreviewData = {
        original: Object.fromEntries(csvData[0].map((header, i) => [header, row[i]])),
        mapped,
        errors: validateMappedData({ original: {}, mapped }) // Add validation
      };

      return previewData;
    });
    setPreviewData(preview);
    setCurrentStep('preview');
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      // Process the data in batches
      for (const row of previewData) {
        if (row.errors && row.errors.length > 0) continue; // Skip rows with errors
        
        // Insert data with proper typing
        const { error } = await supabase
          .from(selectedTable)
          .insert({
            ...row.mapped,
            name: row.mapped.name,
            slug: row.mapped.slug,
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Data imported successfully',
      });
      setCurrentStep('upload');
      setCSVData([]);
      setColumnMappings({});
      setPreviewData([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-4">
            <Select value={selectedTable} onValueChange={(value: ImportableTables) => setSelectedTable(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="printer_parts">Printer Parts</SelectItem>
                <SelectItem value="manufacturers">Manufacturers</SelectItem>
                <SelectItem value="printer_part_categories">Categories</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
              />
              <Button disabled={importing}>
                <FileUp className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          </div>
        );

      case 'mapping':
        return (
          <ColumnMappingStep
            headers={csvData[0]}
            onComplete={handleColumnMappingComplete}
          />
        );

      case 'preview':
        return (
          <PreviewStep
            data={previewData}
            onConfirm={handleImport}
            onBack={() => setCurrentStep('mapping')}
            importing={importing}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>Import data from CSV files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Step indicators */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {(['upload', 'mapping', 'preview', 'import'] as ImportStep[]).map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index !== 0 ? 'ml-2' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {step === 'upload' && <Upload className="w-4 h-4" />}
                  {step === 'mapping' && <Table className="w-4 h-4" />}
                  {step === 'preview' && <FileUp className="w-4 h-4" />}
                  {step === 'import' && <Check className="w-4 h-4" />}
                </div>
                {index < 3 && (
                  <div className="w-8 h-0.5 bg-muted ml-2" />
                )}
              </div>
            ))}
          </div>

          {renderStepContent()}
        </div>
      </CardContent>
    </Card>
  );
};

