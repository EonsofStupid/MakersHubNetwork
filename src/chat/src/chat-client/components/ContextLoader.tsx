
import React from 'react';

export const ContextLoader: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <span>Context:</span>
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Default</span>
    </div>
  );
};
