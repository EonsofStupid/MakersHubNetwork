import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { 
  Clock, 
  User, 
  Calendar,
  GitBranch,
  FileText
} from 'lucide-react';

interface DiffMetadataProps {
  metadata: Record<string, any>;
  label: string;
}

export const DiffMetadata: React.FC<DiffMetadataProps> = ({ metadata, label }) => {
  return (
    <Card className="p-4 space-y-3 bg-background/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        {metadata.created_at && (
          <>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(metadata.created_at), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(metadata.created_at), 'p')}</span>
            </div>
          </>
        )}
        {metadata.created_by && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{metadata.created_by}</span>
          </div>
        )}
        {metadata.version_number && (
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>Version {metadata.version_number}</span>
          </div>
        )}
        {metadata.change_summary && (
          <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
            <FileText className="w-4 h-4" />
            <p>{metadata.change_summary}</p>
          </div>
        )}
      </div>
    </Card>
  );
};