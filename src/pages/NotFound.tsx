
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-10 text-center">
      <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="text-primary hover:underline">Go back home</Link>
    </div>
  );
}
