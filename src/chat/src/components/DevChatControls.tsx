
import React from 'react';
import { useDevChat } from '../providers/DevChatProvider';

export const DevChatControls: React.FC = () => {
  const { mode } = useDevChat();
  
  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Dev Chat</span>
          <span className="px-2 py-1 text-xs bg-blue-600 rounded-full">
            {mode} mode
          </span>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600">
            Clear
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-500">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
