import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RevisionPreviewProps {
  revision: any;
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionPreview: React.FC<RevisionPreviewProps> = ({
  revision,
  isOpen,
  onClose
}) => {
  if (!revision) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview Revision</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full mt-4">
          <div className="space-y-4 p-4">
            {revision.content.type === 'page' ? (
              <div className="prose prose-invert max-w-none">
                <h1>{revision.content.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: revision.content.body }} />
              </div>
            ) : (
              <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(revision.content, null, 2)}
              </pre>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};