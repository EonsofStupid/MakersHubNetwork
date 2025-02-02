import React from 'react';
import { ImportWizard } from '@/components/admin/components/import/ImportWizard';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const CSVOperations = () => {
  const handleImport = async (data: any) => {
    try {
      console.log('Importing CSV data:', data);
      toast.success('CSV import successful');
    } catch (error) {
      console.error('CSV import error:', error);
      toast.error('CSV import failed');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6 bg-black/40 border-white/10">
        <h2 className="text-2xl font-bold mb-4">CSV Operations</h2>
        <ImportWizard 
          type="csv" 
          onImport={handleImport}
        />
      </Card>
    </div>
  );
};

export default CSVOperations;