
import { useState, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { useThemeStore } from '@/stores/theme/themeStore';

// Debug state atoms
export const showThemeOverlayAtom = atom(false);
export const hoveredTokenAtom = atom<string | null>(null);
export const inspectModeAtom = atom(false);

export function useThemeDebug() {
  const { tokens, loadStatus } = useThemeStore();
  const [showOverlay, setShowOverlay] = useAtom(showThemeOverlayAtom);
  const [hoveredToken, setHoveredToken] = useAtom(hoveredTokenAtom);
  const [inspectMode, setInspectMode] = useAtom(inspectModeAtom);
  const [tokenList, setTokenList] = useState<Array<{ key: string; value: string }>>([]);
  
  // Transform tokens into a list for display
  useEffect(() => {
    if (tokens) {
      const list = Object.entries(tokens).map(([key, value]) => ({ 
        key, 
        value: typeof value === 'string' ? value : String(value || '')
      }));
      setTokenList(list);
    }
  }, [tokens]);

  // Toggle inspect mode
  const toggleInspectMode = () => {
    setInspectMode(prev => !prev);
    
    // Toggle the css class on body
    if (!inspectMode) {
      document.body.classList.add('theme-inspect-mode');
    } else {
      document.body.classList.remove('theme-inspect-mode');
    }
  };

  return {
    tokens,
    tokenList,
    isLoaded: loadStatus === 'success',
    showOverlay,
    hoveredToken,
    inspectMode,
    toggleOverlay: () => setShowOverlay(prev => !prev),
    toggleInspectMode,
    setHoveredToken,
  };
}
