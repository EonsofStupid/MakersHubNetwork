
import React from 'react';
import { Link } from 'react-router-dom';

export function PublicHome() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold mb-6 text-[var(--impulse-text-primary)]">
          Welcome to Impulsivity
        </h1>
        
        <p className="text-lg mb-8 text-[var(--impulse-text-secondary)] max-w-2xl">
          A modern web platform with powerful theming capabilities.
        </p>
        
        <div className="flex gap-4">
          <Link 
            to="/admin" 
            className="bg-[var(--impulse-primary)] text-[var(--impulse-text-primary)] px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Go to Admin
          </Link>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[var(--impulse-secondary)] text-[var(--impulse-text-primary)] px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}

export default PublicHome;
