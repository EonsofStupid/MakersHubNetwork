
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ImportPreviewData } from '../../../types/import';
import { ArrowLeft, Upload } from 'lucide-react';

type Props = {
  data: ImportPreviewData[];
  onConfirm: () => void;
  onBack: () => void;
  importing: boolean;
};

export const PreviewStep = ({ data, onConfirm, onBack, importing }: Props) => {
  const headers = data.length > 0 ? Object.keys(data[0].mapped) : [];

  return (
    <div className="space-y-6">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 5).map((row, index) => (
              <TableRow key={index}>
                {headers.map(header => (
                  <TableCell key={header}>{row.mapped[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > 5 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing first 5 rows of {data.length} total rows
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={importing}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mapping
        </Button>
        <Button onClick={onConfirm} disabled={importing}>
          {importing ? (
            'Importing...'
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
