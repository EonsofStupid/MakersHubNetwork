export type ComponentType = 
  | 'bearings'
  | 'extruders'
  | 'addons'
  | 'other';

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  children?: NavigationItem[];
}