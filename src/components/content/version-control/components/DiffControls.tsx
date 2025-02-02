import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Search,
  ChevronLeft, 
  ChevronRight,
  SplitSquareHorizontal,
  Columns
} from 'lucide-react';
import type { DiffControlsProps } from '../types/diff';
import { useDiffContext } from '../context/DiffContext';
import { toast } from 'sonner';

export const DiffControls: React.FC<DiffControlsProps> = ({
  navigation,
  viewMode,
  highlightMode,
  searchState,
  onNavigate,
  onViewModeChange,
  onHighlightModeChange,
  onSearch,
  onToggleCase,
  onToggleRegex
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      document.getElementById('diff-search')?.focus();
    } else if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      onNavigate('prev');
    } else if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      onNavigate('next');
    }
  }, [onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('prev')}
            aria-label="Previous change"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {navigation.currentIndex + 1} of {navigation.totalChanges}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('next')}
            aria-label="Next change"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange(viewMode === 'unified' ? 'split' : 'unified')}
            aria-label={`Switch to ${viewMode === 'unified' ? 'split' : 'unified'} view`}
          >
            {viewMode === 'unified' ? (
              <SplitSquareHorizontal className="h-4 w-4 mr-2" />
            ) : (
              <Columns className="h-4 w-4 mr-2" />
            )}
            {viewMode === 'unified' ? 'Split View' : 'Unified View'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="diff-search"
            type="text"
            placeholder="Search in diff..."
            value={searchState.query}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 w-[200px]"
            aria-label="Search in diff"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={searchState.caseSensitive}
            onCheckedChange={onToggleCase}
            aria-label="Case sensitive search"
          />
          <span className="text-sm">Case Sensitive</span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={searchState.mode === 'regex'}
            onCheckedChange={onToggleRegex}
            aria-label="Regular expression search"
          />
          <span className="text-sm">Regex</span>
        </div>
      </div>
    </div>
  );
};