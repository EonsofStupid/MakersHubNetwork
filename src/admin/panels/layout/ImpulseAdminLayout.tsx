
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ImpulseAdminLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function ImpulseAdminLayout({ title, children }: ImpulseAdminLayoutProps) {
  const pageTitle = `${title ? `${title} | ` : ''}Admin Dashboard`;

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {children}
    </div>
  );
}
