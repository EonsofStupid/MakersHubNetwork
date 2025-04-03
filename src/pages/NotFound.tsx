
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-8xl font-bold text-primary">404</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mt-6 text-base text-muted-foreground max-w-md text-center">
        Sorry, we couldn't find the page you're looking for. The link might be incorrect, or the page may have been moved or deleted.
      </p>
      <div className="mt-10">
        <Link to="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
