import type { Change } from 'diff';

// Core types and enums
export type DiffHighlightMode = 'char' | 'word' | 'line';
export type DiffViewMode = 'unified' | 'split';
export type DiffSearchMode = 'simple' | 'regex' | 'fuzzy';
export type DiffChangeType = 'addition' | 'deletion' | 'modification' | 'context';
export type DiffTheme = 'light' | 'dark' | 'high-contrast';
export type DiffType = 'chars' | 'words';

// Search and Navigation interfaces
export interface DiffSearchMatch {
  lineNumber: number;
  matchStart: number;
  matchEnd: number;
  content: string;
  type: DiffChangeType;
}

export interface DiffSearchState {
  query: string;
  matches: DiffSearchMatch[];
  currentMatchIndex: number;
  isSearching: boolean;
  mode: DiffSearchMode;
  caseSensitive: boolean;
}

export interface DiffNavigationState {
  currentIndex: number;
  totalChanges: number;
  type: DiffHighlightMode;
}

// Content and Metadata interfaces
export interface DiffChange extends Omit<Change, 'added' | 'removed'> {
  value: string;
  added: boolean;
  removed: boolean;
  lineNumber?: number;
  metadata?: DiffLineMetadata;
}

export interface DiffLineMetadata {
  author: string;
  timestamp: Date;
  commitId?: string;
  lineHistory?: DiffLineHistory[];
}

export interface DiffLineHistory {
  author: string;
  timestamp: Date;
  change: string;
}

export interface DiffSection {
  id: string;
  startLine: number;
  endLine: number;
  type: DiffChangeType;
  isExpanded: boolean;
  content: DiffChange[];
}

export interface DiffFileMetadata {
  path: string;
  size: number;
  lastModified: Date;
  mimeType?: string;
}

export interface DiffAuthorMetadata {
  name: string;
  email: string;
  timestamp: Date;
}

export interface DiffMetadata {
  totalAdditions: number;
  totalDeletions: number;
  totalModifications: number;
  fileInfo: DiffFileMetadata;
  authorInfo: DiffAuthorMetadata;
}

// Component Props interfaces
export interface DiffViewerOptions {
  highlightMode: DiffHighlightMode;
  viewMode: DiffViewMode;
  theme: DiffTheme;
  showLineNumbers: boolean;
  contextLines: number;
  performance: DiffPerformanceOptions;
  accessibility: DiffAccessibilityConfig;
}

export interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  oldMetadata?: Record<string, unknown>;
  newMetadata?: Record<string, unknown>;
  options?: DiffViewerOptions;
  onNavigate?: (index: number) => void;
  onSearch?: (query: string) => void;
}

export interface DiffControlsProps {
  navigation: DiffNavigationState;
  viewMode: DiffViewMode;
  highlightMode: DiffHighlightMode;
  searchState: DiffSearchState;
  onNavigate: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: DiffViewMode) => void;
  onHighlightModeChange: (mode: DiffHighlightMode) => void;
  onSearch: (query: string) => void;
  onToggleCase: () => void;
  onToggleRegex: () => void;
}

export interface DiffSectionProps {
  content: DiffChange[];
  isExpanded?: boolean;
  onToggle?: () => void;
  contextLines?: number;
  showLineNumbers?: boolean;
  metadata?: {
    startLine: number;
    endLine: number;
    type: DiffChangeType;
  };
  searchQuery?: string;
  currentSearchIndex?: number;
  searchResults?: Array<{
    lineIndex: number;
    matchIndex: number;
    length: number;
  }>;
}

// Context and State Management
export interface DiffContextValue {
  navigation: DiffNavigationState;
  searchState: DiffSearchState;
  viewMode: DiffViewMode;
  highlightMode: DiffHighlightMode;
  sections: Map<string, DiffSection>;
  setNavigation: (state: DiffNavigationState) => void;
  setSearchState: (state: DiffSearchState) => void;
  setViewMode: (mode: DiffViewMode) => void;
  setHighlightMode: (mode: DiffHighlightMode) => void;
  setSections: (sections: Map<string, DiffSection>) => void;
  toggleSection: (sectionId: string) => void;
  toggleAllSections: (expanded: boolean) => void;
}

// Accessibility and Performance interfaces
export interface DiffAccessibilityConfig {
  ariaLabels: {
    viewer: string;
    controls: string;
    search: string;
    navigation: string;
    section: string;
  };
  keyboardShortcuts: {
    nextDiff: string[];
    prevDiff: string[];
    toggleSearch: string[];
    expandAll: string[];
    collapseAll: string[];
    closeSearch: string[];
  };
}

export interface DiffPerformanceOptions {
  chunkSize: number;
  virtualizedOptions: {
    overscanCount: number;
    itemSize: number;
  };
  deferredLoading: boolean;
  memoizationKey: string;
}

// Testing interfaces
export interface DiffTestCase {
  input: {
    oldContent: string;
    newContent: string;
    options?: DiffViewerOptions;
  };
  expected: {
    additions: number;
    deletions: number;
    modifications: number;
    sections: DiffSection[];
  };
}