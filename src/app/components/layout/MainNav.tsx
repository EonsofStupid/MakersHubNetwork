
import React from 'react';
import { MainNav } from '@/app/components/MainNav';
import { cn } from '@/shared/utils/cn';

interface MainNavLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export function MainNavLayout({ className, children }: MainNavLayoutProps) {
  return (
    <div className={cn('container max-w-7xl mx-auto', className)}>
      <MainNav />
      <main>{children}</main>
    </div>
  );
}
