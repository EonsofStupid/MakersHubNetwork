import { useEffect } from 'react';
import { LayoutProps, LayoutSectionProps } from '../types';
import { useLayout } from '../hooks/useLayout';
import { calculateContentHeight } from '../utils/layout-utils';
import { cn } from '@/app/utils/cn';
import { AnimatedComponent } from '@/features/components/animations/AnimatedComponent';

export const Header = ({ children, className, hidden }: LayoutSectionProps) => {
  if (hidden) return null;
  return (
    <AnimatedComponent
      animation={{
        type: 'slide',
        direction: 'in',
        duration: 200,
        custom: {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -100, opacity: 0 },
        },
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-background border-b',
        className
      )}
    >
      {children}
    </AnimatedComponent>
  );
};

export const Sidebar = ({ children, className, hidden }: LayoutSectionProps) => {
  if (hidden) return null;
  return (
    <AnimatedComponent
      animation={{
        type: 'slide',
        direction: 'in',
        duration: 200,
        custom: {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 },
        },
      }}
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40',
        'bg-background border-r',
        className
      )}
    >
      {children}
    </AnimatedComponent>
  );
};

export const Footer = ({ children, className, hidden }: LayoutSectionProps) => {
  if (hidden) return null;
  return (
    <AnimatedComponent
      animation={{
        type: 'slide',
        direction: 'in',
        duration: 200,
        custom: {
          initial: { y: 100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 100, opacity: 0 },
        },
      }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-background border-t',
        className
      )}
    >
      {children}
    </AnimatedComponent>
  );
};

export const Content = ({ children, className }: Omit<LayoutSectionProps, 'hidden'>) => {
  return (
    <main className={cn('relative flex-1 overflow-auto', className)}>
      {children}
    </main>
  );
};

export const Layout = ({
  config,
  header,
  sidebar,
  footer,
  children,
  className,
}: LayoutProps) => {
  const {
    isSidebarCollapsed,
    isSidebarHidden,
    isHeaderHidden,
    isFooterHidden,
    config: layoutConfig,
  } = useLayout(config);

  // Update CSS variables for layout measurements
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--header-height', `${layoutConfig.headerHeight}px`);
    root.style.setProperty('--footer-height', `${layoutConfig.footerHeight}px`);
    root.style.setProperty(
      '--sidebar-width',
      `${isSidebarCollapsed ? layoutConfig.sidebarCollapsedWidth : layoutConfig.sidebarWidth}px`
    );
  }, [
    layoutConfig.headerHeight,
    layoutConfig.footerHeight,
    layoutConfig.sidebarWidth,
    layoutConfig.sidebarCollapsedWidth,
    isSidebarCollapsed,
  ]);

  // Calculate content height
  useEffect(() => {
    const updateContentHeight = () => {
      const height = calculateContentHeight(
        window.innerHeight,
        layoutConfig.headerHeight,
        layoutConfig.footerHeight,
        isHeaderHidden,
        isFooterHidden
      );
      document.documentElement.style.setProperty('--content-height', `${height}px`);
    };

    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);
    return () => window.removeEventListener('resize', updateContentHeight);
  }, [layoutConfig.headerHeight, layoutConfig.footerHeight, isHeaderHidden, isFooterHidden]);

  return (
    <div
      className={cn(
        'relative min-h-screen',
        'flex flex-col bg-background text-foreground',
        className
      )}
    >
      <Header
        hidden={isHeaderHidden}
        className="h-[--header-height]"
      >
        {header}
      </Header>

      <Sidebar
        hidden={isSidebarHidden}
        className={cn(
          'w-[--sidebar-width] transition-[width]',
          'pt-[--header-height] pb-[--footer-height]'
        )}
      >
        {sidebar}
      </Sidebar>

      <Content
        className={cn(
          'mt-[--header-height] mb-[--footer-height]',
          !isSidebarHidden && 'ml-[--sidebar-width]'
        )}
      >
        {children}
      </Content>

      <Footer
        hidden={isFooterHidden}
        className="h-[--footer-height]"
      >
        {footer}
      </Footer>
    </div>
  );
}; 