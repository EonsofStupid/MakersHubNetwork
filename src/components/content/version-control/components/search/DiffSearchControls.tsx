import React, { useEffect } from 'react';
import { Search, CaseSensitive, Code, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useDiffSearch } from '../../context/DiffSearchContext';

export const DiffSearchControls: React.FC = () => {
  const {
    searchState,
    setQuery,
    toggleCaseSensitive,
    toggleSearchMode,
    navigateSearch,
    clearSearch
  } = useDiffSearch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('diff-search')?.focus();
      } else if (e.key === 'F3' || (e.ctrlKey && e.key === 'g')) {
        e.preventDefault();
        navigateSearch('next');
      } else if (e.key === 'F3' && e.shiftKey) {
        e.preventDefault();
        navigateSearch('prev');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateSearch, clearSearch]);

  return (
    <div className="flex items-center gap-4 p-2 border-b border-border/50">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="diff-search"
          type="text"
          placeholder="Search in diff (Ctrl+F)"
          value={searchState.query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateSearch('prev')}
          disabled={!searchState.results.length}
          title="Previous match (Shift+F3)"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateSearch('next')}
          disabled={!searchState.results.length}
          title="Next match (F3)"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={searchState.caseSensitive}
            onCheckedChange={toggleCaseSensitive}
            id="case-sensitive"
          />
          <label htmlFor="case-sensitive" className="text-sm">
            <CaseSensitive className="h-4 w-4" />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={searchState.mode === 'regex'}
            onCheckedChange={toggleSearchMode}
            id="regex-mode"
          />
          <label htmlFor="regex-mode" className="text-sm">
            <Code className="h-4 w-4" />
          </label>
        </div>

        {searchState.results.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {searchState.currentIndex + 1} of {searchState.results.length}
          </span>
        )}
      </div>
    </div>
  );
};