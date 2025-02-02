import React from 'react';
import { ImportWizard } from '@/components/admin/components/import/ImportWizard';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export const UnifiedDataImport = () => {
  const handleImport = async (data: any) => {
    try {
      console.log('Importing data:', data);
      toast.success('Import successful');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-white/10">
      <ImportWizard 
        type="csv" 
        onImport={handleImport}
      />
    </Card>
  );
};