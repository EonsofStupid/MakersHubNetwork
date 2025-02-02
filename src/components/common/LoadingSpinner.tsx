import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;