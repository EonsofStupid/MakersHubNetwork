import React, { useMemo, useState } from 'react';
import { diffChars, diffWords } from 'diff';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiffHighlightMode, DiffChange, DiffViewerProps } from '../types/diff';
import { DiffProvider } from '../context/DiffContext';
import { DiffMetadata } from './DiffMetadata';

export const RevisionDiff: React.FC<DiffViewerProps> = ({
  oldContent,
  newContent,
  oldMetadata,
  newMetadata
}) => {
  const [diffType, setDiffType] = useState<DiffHighlightMode>('word');
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);

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

  const changes = useMemo(() => 
    diffs.filter(d => d.added || d.removed), [diffs]
  );

  const navigateDiff = (direction: 'prev' | 'next') => {
    setCurrentDiffIndex(prev => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : changes.length - 1;
      }
      return prev < changes.length - 1 ? prev + 1 : 0;
    });
  };

  const renderDiffContent = (content: DiffChange[]) => (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {content.map((part, i) => {
        const isCurrentDiff = (part.added || part.removed) && 
          changes.indexOf(part) === currentDiffIndex;

        return (
          <span
            key={i}
            className={`
              ${part.added ? 'bg-green-500/20 text-green-400' : ''}
              ${part.removed ? 'bg-red-500/20 text-red-400 line-through' : ''}
              ${isCurrentDiff ? 'ring-2 ring-primary/50 rounded' : ''}
              ${!part.added && !part.removed ? 'text-zinc-400' : ''}
              transition-all
            `}
          >
            {part.value}
          </span>
        );
      })}
    </div>
  );

  return (
    <DiffProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDiffType('word')}
              className={diffType === 'word' ? 'bg-primary/20' : ''}
            >
              Word Diff
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDiffType('char')}
              className={diffType === 'char' ? 'bg-primary/20' : ''}
            >
              Character Diff
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDiff('prev')}
              disabled={changes.length === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {changes.length > 0 
                ? `Change ${currentDiffIndex + 1} of ${changes.length}`
                : 'No changes'
              }
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDiff('next')}
              disabled={changes.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="relative">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {renderDiffContent(diffs.filter(d => !d.added))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="relative">
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                {renderDiffContent(diffs.filter(d => !d.removed))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </DiffProvider>
  );
};