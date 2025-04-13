
import React from 'react';

interface AdminSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminSection({ title, children, className = '' }: AdminSectionProps) {
  return (
    <div className={`rounded-lg border border-border bg-background p-4 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      )}
      {children}
    </div>
  );
}

export default AdminSection;
