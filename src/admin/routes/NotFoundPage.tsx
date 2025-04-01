
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="container py-12 flex flex-col items-center justify-center text-center">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-heading mb-2">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex gap-3">
        <Button onClick={() => navigate('/admin')}>
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
