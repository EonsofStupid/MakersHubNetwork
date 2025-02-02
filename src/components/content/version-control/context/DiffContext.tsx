import React, { createContext, useContext, useState } from 'react';
import type { 
  DiffContextValue, 
  DiffNavigationState, 
  DiffSearchState, 
  DiffViewMode, 
  DiffHighlightMode,
  DiffSection
} from '../types/diff';

const DiffContext = createContext<DiffContextValue | undefined>(undefined);

export const useDiffContext = () => {
  const context = useContext(DiffContext);
  if (!context) {
    throw new Error('useDiffContext must be used within a DiffProvider');
  }
  return context;
};

interface DiffProviderProps {
  children: React.ReactNode;
}

export const DiffProvider: React.FC<DiffProviderProps> = ({ children }) => {
  const [navigation, setNavigation] = useState<DiffNavigationState>({
    currentIndex: 0,
    totalChanges: 0,
    type: 'word'
  });

  const [searchState, setSearchState] = useState<DiffSearchState>({
    query: '',
    matches: [],
    currentMatchIndex: 0,
    isSearching: false,
    mode: 'simple',
    caseSensitive: false
  });

  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  const [highlightMode, setHighlightMode] = useState<DiffHighlightMode>('word');
  const [sections, setSections] = useState<Map<string, DiffSection>>(new Map());

  const toggleSection = (sectionId: string) => {
    setSections(prev => {
      const newSections = new Map(prev);
      const section = newSections.get(sectionId);
      if (section) {
        newSections.set(sectionId, { ...section, isExpanded: !section.isExpanded });
      }
      return newSections;
    });
  };

  const toggleAllSections = (expanded: boolean) => {
    setSections(prev => {
      const newSections = new Map(prev);
      for (const [id, section] of newSections) {
        newSections.set(id, { ...section, isExpanded: expanded });
      }
      return newSections;
    });
  };

  const value: DiffContextValue = {
    navigation,
    searchState,
    viewMode,
    highlightMode,
    sections,
    setNavigation,
    setSearchState,
    setViewMode,
    setHighlightMode,
    setSections,
    toggleSection,
    toggleAllSections
  };

  return (
    <DiffContext.Provider value={value}>
      {children}
    </DiffContext.Provider>
  );
};