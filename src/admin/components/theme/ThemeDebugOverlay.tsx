
import React from 'react';
import { useThemeDebug } from '@/admin/hooks/useThemeDebug';

export function ThemeDebugOverlay() {
  const { 
    showOverlay, 
    tokenList, 
    hoveredToken, 
    inspectMode,
    toggleOverlay,
    toggleInspectMode,
    setHoveredToken
  } = useThemeDebug();
  
  if (!showOverlay) {
    return (
      <button 
        onClick={toggleOverlay}
        className="fixed bottom-4 right-4 z-50 p-2 bg-black/80 text-white rounded-md text-sm"
      >
        Show Theme
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 text-white rounded-md w-64 max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Theme Tokens</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleInspectMode}
            className={`p-1 text-xs rounded ${inspectMode ? 'bg-primary/80 text-black' : 'bg-gray-700'}`}
          >
            Inspect
          </button>
          <button 
            onClick={toggleOverlay}
            className="p-1 bg-gray-700 text-xs rounded"
          >
            Hide
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        {tokenList.map(({ key, value }) => (
          <div 
            key={key}
            onMouseEnter={() => setHoveredToken(key)}
            onMouseLeave={() => setHoveredToken(null)}
            className={`flex justify-between text-xs p-1 rounded 
              ${hoveredToken === key ? 'bg-gray-700' : ''}`}
          >
            <span>--{key}</span>
            <span className="font-mono">
              {key.includes('color') && (
                <span 
                  className="inline-block w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: value }} 
                />
              )}
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
