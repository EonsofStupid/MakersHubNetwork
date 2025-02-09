
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

type ImportableTables = 'printer_parts' | 'manufacturers' | 'printer_part_categories';

export const ImportTab = () => {
  const [importing, setImporting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<ImportableTables>('printer_parts');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTable) return;

    setImporting(true);
    try {
      const content = await file.text();
      let data = JSON.parse(content);

      const { error } = await supabase
        .from(selectedTable)
        .insert(data);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Data imported successfully',
      });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Data</CardTitle>
        <CardDescription>Import data from JSON files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            accept=".json"
            onChange={handleFileUpload}
            disabled={importing || !selectedTable}
          />
          <Button disabled={importing}>
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

