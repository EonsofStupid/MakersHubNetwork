
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { ImportStep, ImportPreviewData, ImportSession } from '../../types/import';
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
  const [importSession, setImportSession] = useState<ImportSession | null>(null);
  const { toast } = useToast();

  const validateMappedData = (data: ImportPreviewData): ValidationError[] => {
    const errors: ValidationError[] = [];
    const requiredFields = {
      printer_parts: ['name', 'slug'],
      manufacturers: ['name', 'slug'],
      printer_part_categories: ['name', 'slug']
    };

    const required = requiredFields[selectedTable];
    required.forEach(field => {
      if (!data.mapped[field]) {
        errors.push({
          row: 0,
          column: field,
          message: `${field} is required`
        });
      }
    });

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
      );
      
      // Create new import session
      const { data: session, error } = await supabase
        .from('import_sessions')
        .insert({
          total_rows: rows.length - 1, // Exclude header row
          status: 'pending',
          original_filename: file.name,
        })
        .select()
        .single();

      if (error) throw error;

      setImportSession(session as ImportSession);
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

  const handleColumnMappingComplete = async (mappings: Record<string, string>) => {
    if (!importSession) return;

    try {
      // Update import session with mapping config
      const { error } = await supabase
        .from('import_sessions')
        .update({
          mapping_config: mappings,
          status: 'processing',
        })
        .eq('id', importSession.id);

      if (error) throw error;

      setColumnMappings(mappings);
      
      // Generate preview data
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
          errors: validateMappedData({ original: {}, mapped })
        };

        return previewData;
      });

      setPreviewData(preview);
      setCurrentStep('preview');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save column mappings',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!importSession) return;

    try {
      // Update session status
      await supabase
        .from('import_sessions')
        .update({ status: 'processing' })
        .eq('id', importSession.id);

      let successCount = 0;
      let errorCount = 0;

      // Process the data in batches
      for (const [index, row] of previewData.entries()) {
        if (row.errors && row.errors.length > 0) {
          errorCount++;
          // Log error
          await supabase.from('import_errors').insert({
            import_session_id: importSession.id,
            row_number: index + 1,
            error_type: 'validation',
            error_message: row.errors.map(e => e.message).join(', '),
          });
          continue;
        }

        try {
          // Insert data with proper typing
          const { error } = await supabase
            .from(selectedTable)
            .insert(row.mapped);

          if (error) {
            errorCount++;
            await supabase.from('import_errors').insert({
              import_session_id: importSession.id,
              row_number: index + 1,
              error_type: 'database',
              error_message: error.message,
            });
          } else {
            successCount++;
          }
        } catch (error) {
          errorCount++;
          // Log error
          await supabase.from('import_errors').insert({
            import_session_id: importSession.id,
            row_number: index + 1,
            error_type: 'system',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });
        }

        // Update progress
        await supabase
          .from('import_sessions')
          .update({
            processed_rows: index + 1,
            success_count: successCount,
            error_count: errorCount,
          })
          .eq('id', importSession.id);
      }

      // Update final status
      await supabase
        .from('import_sessions')
        .update({
          status: errorCount === 0 ? 'completed' : 'completed_with_errors',
          processed_rows: previewData.length,
          success_count: successCount,
          error_count: errorCount,
        })
        .eq('id', importSession.id);

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${successCount} rows. ${errorCount} errors.`,
      });

      // Reset state
      setCurrentStep('upload');
      setCSVData([]);
      setColumnMappings({});
      setPreviewData([]);
      setImportSession(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import data',
        variant: 'destructive',
      });

      // Update session status to failed
      if (importSession) {
        await supabase
          .from('import_sessions')
          .update({ status: 'failed' })
          .eq('id', importSession.id);
      }
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

          {currentStep === 'upload' && (
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
                  disabled={!!importSession}
                />
                <Button disabled={!!importSession}>
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'mapping' && (
            <ColumnMappingStep
              headers={csvData[0]}
              onComplete={handleColumnMappingComplete}
            />
          )}

          {currentStep === 'preview' && (
            <PreviewStep
              data={previewData}
              onConfirm={handleImport}
              onBack={() => setCurrentStep('mapping')}
              importing={!!importSession && importSession.status === 'processing'}
            />
          )}

          {importSession && importSession.status === 'processing' && (
            <ImportProgress
              current={importSession.processedRows}
              total={importSession.totalRows}
              status={`Processing row ${importSession.processedRows} of ${importSession.totalRows}`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
