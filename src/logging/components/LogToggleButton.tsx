
import React from 'react';
import { Activity } from 'lucide-react';

export function LogToggleButton() {
  return (
    <button
      className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 z-50"
      onClick={() => {
        // This would toggle the log console visibility in a real implementation
        console.log('Log toggle clicked');
      }}
    >
      <Activity className="h-5 w-5" />
    </button>
  );
}
