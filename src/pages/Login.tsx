
import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { MainNav } from '@/components/MainNav';

export default function LoginPage() {
  const logger = useLogger('LoginPage', LogCategory.AUTH);

  React.useEffect(() => {
    logger.info('Login page mounted');
    
    return () => {
      logger.info('Login page unmounted');
    };
  }, [logger]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-card border border-border rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Login to Impulsivity</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="flex justify-center items-center w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
