
import { NavigationItem } from './NavigationItem';
import { TopNavItem } from './TopNavItem';

// Container Component
export const NavigationContainer = ({ 
  children, 
  expanded = true,
  className = '' 
}: { 
  children: React.ReactNode, 
  expanded?: boolean,
  className?: string 
}) => {
  return (
    <div className={`admin-navigation-container ${expanded ? '' : 'sidebar-collapsed'} ${className}`}>
      {children}
    </div>
  );
};

// Navigation List Component
export const NavigationList = ({ 
  children, 
  containerId = 'main-navigation',
  expanded = true,
  className = '' 
}: { 
  children: React.ReactNode, 
  containerId?: string,
  expanded?: boolean,
  className?: string 
}) => {
  return (
    <div 
      className={`admin-navigation-list ${expanded ? '' : 'sidebar-collapsed'} ${className}`}
      data-container-id={containerId}
      id={containerId}
    >
      {children}
    </div>
  );
};

// Navigation Section Component
export const NavigationSection = ({ 
  children, 
  title,
  expanded = true,
  className = '' 
}: { 
  children: React.ReactNode, 
  title?: string,
  expanded?: boolean,
  className?: string 
}) => {
  return (
    <div className={`navigation-section ${className}`}>
      {title && expanded && (
        <h3 className="text-xs font-medium uppercase text-[var(--impulse-text-secondary)] px-4 py-2">
          {title}
        </h3>
      )}
      <div className="navigation-section-content">
        {children}
      </div>
    </div>
  );
};

export { NavigationItem, TopNavItem };
