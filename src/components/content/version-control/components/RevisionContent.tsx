import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RevisionMetadata } from './RevisionMetadata';
import type { ContentRevision } from '@/integrations/supabase/types/content';

interface RevisionContentProps {
  revision: ContentRevision | null;
}

export const RevisionContent: React.FC<RevisionContentProps> = ({ revision }) => {
  if (!revision) return null;

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        <RevisionMetadata revision={revision} />
        <pre className="bg-background/50 p-4 rounded-lg overflow-x-auto text-sm">
          {JSON.stringify(revision.content, null, 2)}
        </pre>
      </div>
    </ScrollArea>
  );
};