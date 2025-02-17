import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks/useNavigation';
import { NavigationItem, NavigationGroup, NavigationConfig } from '../types';
import { isExternalPath, isPathActive } from '../utils/navigation-utils';
import { useAuthStore } from '@/app/stores/auth/store';
import { cn } from '@/app/utils/cn';
import { AnimatedComponent } from '@/features/components/animations/AnimatedComponent';

interface NavigationProps {
  config: NavigationConfig;
  className?: string;
}

export const Navigation = ({ config, className }: NavigationProps) => {
  const { items, groups, currentPath, setItems, setGroups, toggleGroup } = useNavigation();
  const roles = useAuthStore((state) => state.roles);

  useEffect(() => {
    if (config.items) setItems(config.items);
    if (config.groups) setGroups(config.groups);
  }, [config, setItems, setGroups]);

  const renderNavigationItem = (item: NavigationItem) => {
    // Skip hidden items
    if (item.isHidden) return null;

    // Skip items that require roles the user doesn't have
    if (item.roles && !item.roles.some((role) => roles.includes(role))) {
      return null;
    }

    const isActive = isPathActive(currentPath, item.path);
    const isExternal = isExternalPath(item.path);

    const content = (
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          "hover:bg-primary/10",
          isActive && "bg-primary/20 text-primary",
          "cursor-pointer"
        )}
      >
        {item.icon && (
          <span className={cn("w-5 h-5", isActive && "text-primary")}>
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
            {item.badge}
          </span>
        )}
      </div>
    );

    return (
      <AnimatedComponent
        key={item.id}
        animation={{
          type: 'fade',
          duration: 200,
        }}
      >
        {isExternal ? (
          <a
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {content}
          </a>
        ) : (
          <Link to={item.path} className="block">
            {content}
          </Link>
        )}

        {item.children && item.children.length > 0 && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map(renderNavigationItem)}
          </div>
        )}
      </AnimatedComponent>
    );
  };

  const renderNavigationGroup = (group: NavigationGroup) => {
    // Skip empty groups
    if (group.items.length === 0) return null;

    return (
      <AnimatedComponent
        key={group.id}
        animation={{
          type: 'fade',
          duration: 200,
        }}
      >
        <div className="space-y-1">
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2",
              "text-sm font-medium text-muted-foreground",
              group.isCollapsible && "cursor-pointer hover:text-foreground"
            )}
            onClick={() => group.isCollapsible && toggleGroup(group.id)}
          >
            <span>{group.label}</span>
            {group.isCollapsible && (
              <span className={cn(
                "ml-auto transition-transform",
                group.isExpanded && "rotate-180"
              )}>
                ▼
              </span>
            )}
          </div>

          {(!group.isCollapsible || group.isExpanded) && (
            <div className="space-y-1">
              {group.items.map(renderNavigationItem)}
            </div>
          )}
        </div>
      </AnimatedComponent>
    );
  };

  return (
    <nav className={cn("space-y-4", className)}>
      {items.map(renderNavigationItem)}
      {groups.map(renderNavigationGroup)}
    </nav>
  );
}; 