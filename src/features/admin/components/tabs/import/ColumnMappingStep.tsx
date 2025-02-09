
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type Props = {
  headers: string[];
  onComplete: (mappings: Record<string, string>) => void;
};

const AVAILABLE_FIELDS = {
  basic: [
    { value: 'name', label: 'Name' },
    { value: 'slug', label: 'Slug' },
    { value: 'description', label: 'Description' },
    { value: 'summary', label: 'Summary' },
    { value: 'model_number', label: 'Model Number' },
  ],
  specifications: [
    { value: 'specifications.accuracy', label: 'Accuracy' },
    { value: 'specifications.material', label: 'Material' },
    { value: 'specifications.weight', label: 'Weight' },
  ],
  compatibility: [
    { value: 'compatibility.firmware', label: 'Firmware Compatibility' },
    { value: 'compatibility.printer_models', label: 'Printer Models' },
  ],
  dimensions: [
    { value: 'dimensions.width', label: 'Width' },
    { value: 'dimensions.height', label: 'Height' },
    { value: 'dimensions.length', label: 'Length' },
    { value: 'dimensions.unit', label: 'Unit' },
  ],
  price: [
    { value: 'price_range.min', label: 'Minimum Price' },
    { value: 'price_range.max', label: 'Maximum Price' },
    { value: 'price_range.currency', label: 'Currency' },
  ],
};

export const ColumnMappingStep = ({ headers, onComplete }: Props) => {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const handleFieldMapping = (csvColumn: string, targetField: string) => {
    setMappings(prev => ({
      ...prev,
      [csvColumn]: targetField
    }));
  };

  const handleComplete = () => {
    onComplete(mappings);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {headers.map(header => (
          <Card key={header} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">{header}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <Select
                  value={mappings[header] || ''}
                  onValueChange={(value) => handleFieldMapping(header, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Map to field..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ignore this column</SelectItem>
                    {Object.entries(AVAILABLE_FIELDS).map(([category, fields]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                        {fields.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleComplete} disabled={Object.keys(mappings).length === 0}>
          Continue to Preview
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
