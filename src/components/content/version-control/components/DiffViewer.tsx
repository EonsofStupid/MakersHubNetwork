import React, { useState, useMemo } from 'react';
import { diffChars, diffWords } from 'diff';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { DiffHighlightMode, DiffChange, DiffViewerProps } from '../types/diff';
import { DiffProvider } from '../context/DiffContext';
import { DiffSearchProvider } from '../context/DiffSearchContext';
import { DiffMetadata } from './DiffMetadata';
import { DiffSection } from './DiffSection';
import { DiffSearchControls } from './search/DiffSearchControls';

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldContent,
  newContent,
  oldMetadata,
  newMetadata
}) => {
  const [diffType, setDiffType] = useState<DiffHighlightMode>('word');

  const diffs = useMemo(() => {
    try {
      const diffFn = diffType === 'char' ? diffChars : diffWords;
      const result = diffFn(oldContent, newContent);
      return result.map(change => ({
        ...change,
        added: Boolean(change.added),
        removed: Boolean(change.removed)
      })) as DiffChange[];
    } catch (error) {
      console.error('Error computing diff:', error);
      return [];
    }
  }, [oldContent, newContent, diffType]);

  return (
    <DiffProvider>
      <DiffSearchProvider>
        <div className="space-y-4">
          <DiffSearchControls />
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="relative">
              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  <DiffSection
                    content={diffs.filter(d => !d.added)}
                  />
                </div>
              </ScrollArea>
            </Card>

            <Card className="relative">
              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  <DiffSection
                    content={diffs.filter(d => !d.removed)}
                  />
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </DiffSearchProvider>
    </DiffProvider>
  );
};