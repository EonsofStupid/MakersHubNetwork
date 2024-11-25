import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { importData } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
  const [importing, setImporting] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');

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
        // Simple CSV parsing - you might want to use a library like Papa Parse for more robust parsing
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
        // Convert XML to JSON - this is a simple example
        data = Array.from(xmlDoc.getElementsByTagName('item')).map(item => {
          const obj: Record<string, any> = {};
          Array.from(item.children).forEach(child => {
            obj[child.tagName] = child.textContent;
          });
          return obj;
        });
      }

      await importData(data, selectedTable);
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
          <Select value={selectedTable} onValueChange={setSelectedTable}>
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