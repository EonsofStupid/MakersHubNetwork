
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AuthLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title = 'Authentication',
  description = 'Sign in or create an account',
  children
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | MakersImpulse</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-primary">MakersImpulse</h1>
          <p className="text-center text-muted-foreground mt-2">{description}</p>
        </div>
        
        {children}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>A centralized space for passionate makers</p>
        </div>
      </div>
    </>
  );
};
