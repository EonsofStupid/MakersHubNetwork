import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

const Admin = () => {
  const [importing, setImporting] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableNames | ''>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTable) return;

    setImporting(true);
    try {
      const content = await file.text();
      let data;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
          }, {} as Record<string, any>);
        });
      } else if (file.name.endsWith('.xml')) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        data = Array.from(xmlDoc.getElementsByTagName('item')).map(item => {
          const obj: Record<string, any> = {};
          Array.from(item.children).forEach(child => {
            obj[child.tagName] = child.textContent;
          });
          return obj;
        });
      }

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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Import data from CSV, JSON, or XML files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTable} onValueChange={(value) => setSelectedTable(value as TableNames)}>
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sensors">Sensors</SelectItem>
              <SelectItem value="components">Components</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="file"
            accept=".csv,.json,.xml"
            onChange={handleFileUpload}
            disabled={importing || !selectedTable}
          />

          <Button disabled={importing}>
            {importing ? 'Importing...' : 'Import Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin; 