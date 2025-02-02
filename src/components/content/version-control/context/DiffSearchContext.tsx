import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchState {
  query: string;
  caseSensitive: boolean;
  mode: 'simple' | 'regex';
  currentIndex: number;
  results: Array<{
    lineIndex: number;
    matchIndex: number;
    length: number;
  }>;
  history: string[];
}

interface DiffSearchContextType {
  searchState: SearchState;
  setQuery: (query: string) => void;
  toggleCaseSensitive: () => void;
  toggleSearchMode: () => void;
  navigateSearch: (direction: 'next' | 'prev') => void;
  clearSearch: () => void;
}

const DiffSearchContext = createContext<DiffSearchContextType | undefined>(undefined);

export const useDiffSearch = () => {
  const context = useContext(DiffSearchContext);
  if (!context) {
    throw new Error('useDiffSearch must be used within a DiffSearchProvider');
  }
  return context;
};

export const DiffSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    caseSensitive: false,
    mode: 'simple',
    currentIndex: 0,
    results: [],
    history: []
  });

  const setQuery = useCallback((query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      currentIndex: 0,
      history: query 
        ? Array.from(new Set([query, ...prev.history])).slice(0, 10)
        : prev.history
    }));
  }, []);

  const toggleCaseSensitive = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      caseSensitive: !prev.caseSensitive
    }));
  }, []);

  const toggleSearchMode = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      mode: prev.mode === 'simple' ? 'regex' : 'simple'
    }));
  }, []);

  const navigateSearch = useCallback((direction: 'next' | 'prev') => {
    setSearchState(prev => {
      if (prev.results.length === 0) return prev;
      
      const newIndex = direction === 'next'
        ? (prev.currentIndex + 1) % prev.results.length
        : (prev.currentIndex - 1 + prev.results.length) % prev.results.length;
      
      return {
        ...prev,
        currentIndex: newIndex
      };
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      currentIndex: 0,
      results: []
    }));
  }, []);

  return (
    <DiffSearchContext.Provider
      value={{
        searchState,
        setQuery,
        toggleCaseSensitive,
        toggleSearchMode,
        navigateSearch,
        clearSearch
      }}
    >
      {children}
    </DiffSearchContext.Provider>
  );
};