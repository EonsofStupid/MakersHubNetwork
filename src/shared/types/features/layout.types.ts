
// Layout types
export type LayoutType = 'default' | 'wide' | 'narrow' | 'fullwidth';

export interface LayoutConfig {
  type: LayoutType;
  showSidebar: boolean;
  showFooter: boolean;
}
