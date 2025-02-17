import { NavigationItem } from '../types';

export const findItemByPath = (
  path: string,
  items: NavigationItem[]
): NavigationItem | null => {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }
    if (item.children) {
      const found = findItemByPath(path, item.children);
      if (found) return found;
    }
  }
  return null;
};

export const getBreadcrumbsFromPath = (
  path: string,
  items: NavigationItem[]
): NavigationItem[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: NavigationItem[] = [];
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const item = findItemByPath(currentPath, items);
    if (item) {
      breadcrumbs.push(item);
    }
  }

  return breadcrumbs;
};

export const flattenNavigationItems = (
  items: NavigationItem[]
): NavigationItem[] => {
  return items.reduce<NavigationItem[]>((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenNavigationItems(item.children));
    }
    return acc;
  }, []);
};

export const filterNavigationItemsByRole = (
  items: NavigationItem[],
  userRoles: string[]
): NavigationItem[] => {
  return items
    .filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.some((role) => userRoles.includes(role));
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavigationItemsByRole(item.children, userRoles)
        : undefined,
    }));
};

export const isExternalPath = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://');
};

export const isPathActive = (
  currentPath: string,
  itemPath: string
): boolean => {
  if (itemPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(itemPath);
};

export const getParentPaths = (path: string): string[] => {
  const segments = path.split('/').filter(Boolean);
  return segments.reduce<string[]>(
    (acc, _, index) => {
      acc.push('/' + segments.slice(0, index + 1).join('/'));
      return acc;
    },
    []
  );
}; 