
import React from 'react';
import { cn } from '@/lib/utils';

interface AdminSectionProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function AdminSection({ 
  children, 
  className = '', 
  title, 
  subtitle 
}: AdminSectionProps) {
  return (
    <section className={cn("admin-section mb-6", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
