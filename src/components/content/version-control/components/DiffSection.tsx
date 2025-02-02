import React, { useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from '@/components/ui/card';
import { useDiffSearch } from '../context/DiffSearchContext';
import type { DiffSectionProps, DiffChange } from '../types/diff';

export const DiffSection: React.FC<DiffSectionProps> = ({
  content,
  showLineNumbers = true,
}) => {
  const { searchState } = useDiffSearch();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: content.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 5
  });

  const highlightSearchMatch = useCallback((text: string, lineIndex: number) => {
    if (!searchState.query) return text;

    const matches = searchState.results.filter(
      result => result.lineIndex === lineIndex
    );

    if (!matches.length) return text;

    const parts: { text: string; isHighlight: boolean; isCurrent: boolean }[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      if (match.matchIndex > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.matchIndex),
          isHighlight: false,
          isCurrent: false
        });
      }

      const isCurrent = idx === searchState.currentIndex;
      parts.push({
        text: text.slice(match.matchIndex, match.matchIndex + match.length),
        isHighlight: true,
        isCurrent
      });

      lastIndex = match.matchIndex + match.length;
    });

    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        isHighlight: false,
        isCurrent: false
      });
    }

    return parts.map((part, idx) => (
      <span
        key={idx}
        className={`${
          part.isHighlight
            ? part.isCurrent
              ? 'bg-yellow-500/50 ring-2 ring-yellow-500'
              : 'bg-yellow-500/30'
            : ''
        }`}
      >
        {part.text}
      </span>
    ));
  }, [searchState]);

  const renderLine = useCallback((line: DiffChange, index: number) => {
    const lineClass = `
      ${line.added ? 'bg-green-500/20 text-green-400' : ''}
      ${line.removed ? 'bg-red-500/20 text-red-400 line-through' : ''}
      ${!line.added && !line.removed ? 'text-zinc-400' : ''}
      p-1 font-mono text-sm whitespace-pre-wrap
    `;

    return (
      <div className={lineClass}>
        {showLineNumbers && (
          <span className="inline-block w-12 text-right pr-4 text-zinc-500 select-none">
            {line.lineNumber || index + 1}
          </span>
        )}
        <span>{highlightSearchMatch(line.value, index)}</span>
      </div>
    );
  }, [showLineNumbers, highlightSearchMatch]);

  return (
    <Card className="relative">
      <div
        ref={parentRef}
        className="h-[400px] overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {renderLine(content[virtualRow.index], virtualRow.index)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};