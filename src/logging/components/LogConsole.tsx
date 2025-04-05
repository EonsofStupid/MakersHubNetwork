
import React from 'react';

export function LogConsole() {
  return (
    <div className="fixed bottom-16 right-4 w-80 h-64 bg-gray-900 text-white rounded-md shadow-lg z-50 overflow-hidden flex flex-col">
      <div className="bg-gray-800 p-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Log Console</h3>
        <button className="text-xs text-gray-400 hover:text-white">Clear</button>
      </div>
      <div className="flex-1 p-2 overflow-auto text-xs">
        <div className="opacity-70">Log entries will appear here</div>
      </div>
    </div>
  );
}
