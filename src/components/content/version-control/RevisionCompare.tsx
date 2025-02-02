import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VersionSelector } from './components/VersionSelector';
import { RevisionContent } from './components/RevisionContent';
import { RevisionDiff } from './components/RevisionDiff';
import { RevisionMetadata } from './components/RevisionMetadata';
import { RollbackConfirmation } from './components/RollbackConfirmation';
import type { ContentRevision } from '@/integrations/supabase/types/content';

interface RevisionCompareProps {
  contentId: string;
  currentVersion?: number;
}

export const RevisionCompare: React.FC<RevisionCompareProps> = ({
  contentId,
  currentVersion
}) => {
  const [selectedVersions, setSelectedVersions] = useState<{
    left: number;
    right: number;
  }>({
    left: currentVersion ? currentVersion - 1 : 1,
    right: currentVersion || 1
  });

  const [showRollbackConfirm, setShowRollbackConfirm] = useState(false);
  const [rollbackVersion, setRollbackVersion] = useState<number | null>(null);

  const { data: revisions, isLoading } = useQuery({
    queryKey: ['content-revisions', contentId],
    queryFn: async () => {
      console.log('Fetching revisions for comparison:', contentId);
      
      try {
        const { data, error } = await supabase
          .from('cms_content_revisions')
          .select(`
            id,
            content_id,
            content,
            metadata,
            created_at,
            created_by,
            version_number,
            change_summary,
            rollback_metadata,
            profiles (
              display_name
            )
          `)
          .eq('content_id', contentId)
          .order('version_number', { ascending: false });

        if (error) {
          console.error('Error fetching revisions:', error);
          throw error;
        }

        return data as ContentRevision[];
      } catch (error) {
        console.error('Failed to fetch revisions:', error);
        toast.error('Failed to load revisions');
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!contentId,
  });

  const handleRollback = async (version: number) => {
    try {
      const { data, error } = await supabase.rpc('create_rollback_revision', {
        p_content_id: contentId,
        p_target_version_number: version,
        p_current_content: revisions?.find(r => r.version_number === version)?.content,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      toast.success('Successfully rolled back to version ' + version);
      setShowRollbackConfirm(false);
    } catch (error) {
      console.error('Rollback error:', error);
      toast.error('Failed to rollback version');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!revisions?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No revision history available
      </div>
    );
  }

  const getSelectedRevisions = () => {
    if (!revisions) return { left: null, right: null };
    
    const left = revisions.find(r => r.version_number === selectedVersions.left);
    const right = revisions.find(r => r.version_number === selectedVersions.right);
    
    return { left, right };
  };

  const { left, right } = getSelectedRevisions();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Version */}
        <div className="space-y-4">
          <VersionSelector
            versionNumber={selectedVersions.left}
            maxVersion={revisions.length}
            onVersionChange={(increment) => {
              const newValue = increment ? selectedVersions.left + 1 : selectedVersions.left - 1;
              if (newValue >= 1 && newValue <= revisions.length) {
                setSelectedVersions(prev => ({ ...prev, left: newValue }));
              }
            }}
          />
          {left && (
            <RevisionMetadata
              revision={left}
              showRollbackButton
              onRollbackClick={() => {
                setRollbackVersion(left.version_number);
                setShowRollbackConfirm(true);
              }}
            />
          )}
        </div>

        {/* Right Version */}
        <div className="space-y-4">
          <VersionSelector
            versionNumber={selectedVersions.right}
            maxVersion={revisions.length}
            onVersionChange={(increment) => {
              const newValue = increment ? selectedVersions.right + 1 : selectedVersions.right - 1;
              if (newValue >= 1 && newValue <= revisions.length) {
                setSelectedVersions(prev => ({ ...prev, right: newValue }));
              }
            }}
          />
          {right && (
            <RevisionMetadata
              revision={right}
              showRollbackButton
              onRollbackClick={() => {
                setRollbackVersion(right.version_number);
                setShowRollbackConfirm(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Diff View */}
      {left && right && (
        <RevisionDiff
          oldContent={JSON.stringify(left.content, null, 2)}
          newContent={JSON.stringify(right.content, null, 2)}
        />
      )}

      {/* Rollback Confirmation */}
      <RollbackConfirmation
        isOpen={showRollbackConfirm}
        onClose={() => setShowRollbackConfirm(false)}
        onConfirm={() => rollbackVersion && handleRollback(rollbackVersion)}
        versionNumber={rollbackVersion || 0}
      />
    </div>
  );
};