
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-heading mb-6">Page Not Found</h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
