
import React from 'react';

interface AdminGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  cols?: 1 | 2 | 3 | 4; // Add alias for backward compatibility
  className?: string;
  gap?: number;
}

export function AdminGrid({ children, columns, cols, className = '', gap = 6 }: AdminGridProps) {
  // Use cols as fallback for columns for backward compatibility
  const columnCount = columns || cols || 2;
  
  const getGridClass = () => {
    switch (columnCount) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };
  
  const gapClass = `gap-${gap}`;
  
  return (
    <div className={`grid ${getGridClass()} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

export default AdminGrid;
