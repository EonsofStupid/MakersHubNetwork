
import { Card } from '@/components/ui/card';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentListProps } from '../../types/content.types';

export const ContentList = ({ filter }: ContentListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-4 cyber-card group hover:border-primary/40 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-gradient">Example Content</h3>
          </div>
          <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="mad-scientist-hover"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mad-scientist-hover text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
