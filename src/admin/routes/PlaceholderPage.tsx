
import React from 'react';

interface PlaceholderPageProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({ 
  title = "Coming Soon",
  description = "This page is under construction.",
  icon
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
    </div>
  );
}
