
import React from 'react';

interface AdminSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminSection({ title, children, className = '' }: AdminSectionProps) {
  return (
    <div className={`rounded-lg border border-[var(--impulse-border)] bg-[var(--impulse-bg-card)] p-4 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-[var(--impulse-text-primary)]">{title}</h2>
      )}
      {children}
    </div>
  );
}
