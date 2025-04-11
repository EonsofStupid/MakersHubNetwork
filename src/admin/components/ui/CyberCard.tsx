
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'error';
}

/**
 * CyberCard component for admin UI
 * A styled card component with a cyber/futuristic look
 */
export function CyberCard({
  title,
  children,
  className,
  highlight = false,
  variant = 'default'
}: CyberCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-blue-400/30 bg-blue-900/10';
      case 'secondary':
        return 'border-purple-400/30 bg-purple-900/10';
      case 'warning':
        return 'border-amber-400/30 bg-amber-900/10';
      case 'error':
        return 'border-red-400/30 bg-red-900/10';
      default:
        return 'border-gray-400/30 bg-gray-900/10';
    }
  };
  
  return (
    <Card className={cn(
      'backdrop-blur-sm border',
      getVariantClasses(),
      highlight && 'shadow-lg shadow-blue-500/20',
      className
    )}>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={!title ? 'pt-4' : ''}>
        {children}
      </CardContent>
    </Card>
  );
}

export default CyberCard;
