
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AppLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  title = 'MakersImpulse',
  description = 'A hub for makers building and customizing 3D printers',
  children
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | MakersImpulse</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </>
  );
};
