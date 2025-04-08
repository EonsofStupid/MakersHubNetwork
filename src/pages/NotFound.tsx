
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-muted text-foreground rounded-md hover:bg-muted/90"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
