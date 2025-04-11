
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container flex h-[80vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="text-primary hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
