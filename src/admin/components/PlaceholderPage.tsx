
import React from 'react';
import { Construction } from 'lucide-react';

export interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  requiredPermission?: string;
}

export function PlaceholderPage({ 
  title, 
  description, 
  icon,
  requiredPermission 
}: PlaceholderPageProps) {
  const Icon = icon || <Construction className="h-12 w-12" />;
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] p-8">
      <div className="flex flex-col items-center text-center max-w-lg">
        <div className="rounded-full bg-muted p-6 mb-6">
          {Icon}
        </div>
        <h1 className="text-3xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        {requiredPermission && (
          <div className="mt-4 text-xs text-muted-foreground">
            Required permission: <code className="bg-muted p-1 rounded">{requiredPermission}</code>
          </div>
        )}
      </div>
    </div>
  );
}
