import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Clock, User, Info, GitBranch, Calendar, FileText } from 'lucide-react';
import type { ContentRevision } from '@/integrations/supabase/types/content';

interface RevisionMetadataProps {
  revision: ContentRevision;
  showRollbackButton?: boolean;
  onRollbackClick?: () => void;
}

export const RevisionMetadata: React.FC<RevisionMetadataProps> = ({
  revision,
  showRollbackButton,
  onRollbackClick,
}) => {
  return (
    <Card className="p-4 space-y-3 bg-background/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          Version {revision.version_number}
        </h3>
        {showRollbackButton && onRollbackClick && (
          <button
            onClick={onRollbackClick}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            Rollback to this version
          </button>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{revision.profiles?.display_name || 'Unknown user'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(revision.created_at), 'PPP')}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{format(new Date(revision.created_at), 'p')}</span>
        </div>

        {revision.change_summary && (
          <div className="pt-2 border-t border-primary/10">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <p className="text-sm">{revision.change_summary}</p>
            </div>
          </div>
        )}

        {revision.rollback_metadata && (
          <div className="pt-2 border-t border-primary/10">
            <p className="text-sm text-warning flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Rollback from version {(revision.rollback_metadata as any).target_version}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};